import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { MapView, Marker, Polyline, AMapSdk, MapType } from 'react-native-amap3d';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

interface LatLng {
  latitude: number;
  longitude: number;
}

const Hotel = () => {
  const mapViewRef = useRef<any>(null);
  const navigation = useNavigation();
  const isMounted = useRef(true);

  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<string>('暂无');
  const [fetching, setFetching] = useState(false);
  const [path, setPath] = useState<LatLng[]>([]);
  const [searchList, setSearchList] = useState<any[]>([]);
  const [mapType, setMapType] = useState<MapType>(MapType.Standard);

  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>({
    latitude: 30.543024962216446,
    longitude: 104.06439575294166,
  });

  const [searchText, setSearchText] = useState(''); // 输入框内容
  const [searchMarker, setSearchMarker] = useState<LatLng | null>(null); // 搜索结果 Marker

  useEffect(() => {
    AMapSdk.init('e10d14fadb21e1cfdfa2d6a73041a81c');
    requestLocationPermission();

    return () => {
      isMounted.current = false;
      mapViewRef.current = null;
    };
  }, []);

  const getAddressFromLatLng = async (latitude: number, longitude: number) => {
    try {
      const url = `https://restapi.amap.com/v3/geocode/regeo?location=${longitude},${latitude}&key=${'e10d14fadb21e1cfdfa2d6a73041a81c'}&radius=1000&extensions=all`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === '1') {
        const addr = data.regeocode?.formatted_address || '未找到地址';
        console.log('🗺️ 地址信息:', addr);
        setAddress(addr);
        return addr;
      } else {
        console.warn('高德API返回错误:', data.info);
        return null;
      }
    } catch (error) {
      console.error('❌ 获取地名失败:', error);
      return null;
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('定位权限被拒绝');
        setLoading(false);
        return;
      }
    }
    getLocation();
  };

  const getLocation = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      ({ coords }) => handleLocationSuccess(coords),
      (error) => {
        console.warn('高精度定位失败，尝试低精度', error);
        Geolocation.getCurrentPosition(
          ({ coords }) => handleLocationSuccess(coords),
          (err) => {
            console.error('低精度定位也失败', err);
            if (isMounted.current) {
              Alert.alert('定位失败', '请检查定位权限或网络/GPS设置');
              setLoading(false);
            }
          },
          { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
        );
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 5000 }
    );
  };

  const handleLocationSuccess = (coords: GeolocationCoordinates) => {
    if (!isMounted.current) return;
    setStart({ latitude: coords.latitude, longitude: coords.longitude });
  };

  useEffect(() => {
    if (start) getAddressFromLatLng(start.latitude, start.longitude);
    if (start && end) fetchPath(start, end);
  }, [start, end]);

  const fetchPath = async (origin: LatLng, destination: LatLng) => {
    if (fetching) return;
    setFetching(true);
    setLoading(true);
    try {
      const res = await fetch(
        `https://restapi.amap.com/v3/direction/driving?key=e10d14fadb21e1cfdfa2d6a73041a81c&origin=${origin.longitude},${origin.latitude}&destination=${destination.longitude},${destination.latitude}`
      );
      const data = await res.json();
      const steps = data.route?.paths?.[0]?.steps || [];
      const route: LatLng[] = steps.flatMap((s: any) =>
        s.polyline
          ? s.polyline.split(';').map((p: string) => {
              const [lon, lat] = p.split(',');
              return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
            })
          : []
      );
      if (isMounted.current) setPath(route);
    } catch (e) {
      console.error(e);
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setFetching(false);
      }
    }
  };

  const getLatLngFromAmMap = async (address: string) => {
    setSearchList([])
    try {
      const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(
        address
      )}&key=${'e10d14fadb21e1cfdfa2d6a73041a81c'}`;
      const response = await fetch(url);
      const data = await response.json();

      console.log('dadada', data)

      if (data.status === '1' && data.geocodes.length > 0) {
        setSearchList(data.geocodes)
        return data.geocodes
      } else {
        console.warn('高德返回错误:', data.info);
        return null;
      }
    } catch (error) {
      console.error('❌ 获取经纬度失败:', error);
      return null;
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      Alert.alert('请输入地名');
      return;
    }
    const result = await getLatLngFromAmMap(searchText);
    if (result.length > 0) {
      // setSearchMarker(result);
      // mapViewRef.current?.animateCamera({
      //   target: result,
      //   zoom: 16,
      // });
      
    } else {
      Alert.alert('未找到该地名');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const refreshPath = () => {
    if (start) getAddressFromLatLng(start.latitude, start.longitude);
    if (start && end) fetchPath(start, end);
  };

  const handleSelectSearchItem = (item: any) => {
    const [longitude, latitude] = item.location.split(',').map(Number);
    const latLng = { latitude, longitude };
    setEnd(latLng)
    setSearchMarker(latLng);
    setSearchList([]); // 选中后隐藏下拉
    // mapViewRef.current?.animateCamera({ target: latLng, zoom: 16 });
  };


  // 点击关闭
  const handleOutsidePress = () => {
    if (searchList.length > 0) {
      setSearchList([]);
    }
  };
  
  return (
    // <TouchableWithoutFeedback onPress={() => { 
      // console.log("TouchableWithoutFeedback")
      // Keyboard.dismiss();  // 收起键盘
      // handleOutsidePress(); // 关闭搜索结果
    // }}>
          <View style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Image
            source={require('../assets/image/user.png')}
            style={{ width: 22, height: 22 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.headerAddress}>
          <Text style={styles.headerText}>当前位置</Text>
          <Text style={{ marginTop: 10, textAlign: 'center', color: '#fff', fontSize: 12 }}>
            {address}
          </Text>
        </View>
      </View>
      

      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="输入地名搜索"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={{ color: '#fff' }}>搜索</Text>
        </TouchableOpacity>
      </View>

      {searchList.length > 0 && (
        <View style={styles.searchResultContainer}
        // onStartShouldSetResponder={() => true}
        >
          {searchList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.searchResultItem}
              onPress={() => handleSelectSearchItem(item)}
            >
              <Text>{item.formatted_address}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* 地图 */}
      <View style={styles.map} onStartShouldSetResponder={() => false}>
        {loading || !start || !end ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#d31145" />
            <Text style={{ color: '#666', marginTop: 10 }}>正在加载地图...</Text>
          </View>
        ) : (
          <MapView
            ref={mapViewRef}
            style={StyleSheet.absoluteFill}
            mapType={mapType}
            initialCameraPosition={{ target: start, zoom: 15 }}
            showsTraffic
            showsCompass
            showsScale
          >
            {/* 起点 */}
            <Marker position={start} title="我的位置" />
            {/* 终点 */}
            <Marker position={end} title="目的地" color="red" />
            {/* 搜索结果 */}
            {searchMarker && (
              <Marker
                position={searchMarker}
                title="搜索结果"
                color="blue"
              />
            )}
            {/* 路线 */}
            {path.length > 0 && (
              <Polyline width={10} color="rgba(211,17,69,0.8)" points={path} />
            )}
          </MapView>
        )}

        {/* 悬浮 Picker */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>地图类型：</Text>
          <Picker
            selectedValue={mapType}
            onValueChange={(value) => setMapType(value)}
            style={styles.picker}
            mode="dropdown"
          >
            <Picker.Item label="标准" value={MapType.Standard} />
            <Picker.Item label="卫星" value={MapType.Satellite} />
            <Picker.Item label="夜间" value={MapType.Night} />
            <Picker.Item label="导航" value={MapType.Navi} />
            <Picker.Item label="交通" value={MapType.Bus} />
          </Picker>
        </View>
      </View>

      {/* 刷新按钮 */}
      <TouchableOpacity
        style={[styles.refreshBtn, fetching && { opacity: 0.6 }]}
        onPress={refreshPath}
        disabled={fetching}
      >
        <Text style={styles.refreshText}>{fetching ? '刷新中…' : '刷新路线'}</Text>
      </TouchableOpacity>
    </View>
    // </TouchableWithoutFeedback>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: '#d31145',
    paddingHorizontal: 16,
  },
  backBtn: { position: 'absolute', left: 16 },
  headerText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  headerAddress: { flexDirection: 'column', alignItems: 'center' },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchBtn: {
    marginLeft: 8,
    backgroundColor: '#d31145',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },

  map: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  pickerContainer: {
    position: 'absolute',
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 100,
  },
  pickerLabel: { color: '#fff', marginRight: 8 },
  picker: { flex: 1, color: '#fff', width: 130 },

  refreshBtn: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    backgroundColor: '#d31145',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#d31145',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  refreshText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  searchResultContainer: { position: 'absolute', top: 100, left: 10, right: 10, backgroundColor: '#fff', borderRadius: 8, maxHeight: 'auto', zIndex: 999, elevation: 5 },
  searchResultItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },

  map: { flex: 1 },
});

export default Hotel;
