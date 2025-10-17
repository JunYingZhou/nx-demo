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
  const [fetching, setFetching] = useState(false);
  const [path, setPath] = useState<LatLng[]>([]);
  const [mapType, setMapType] = useState<MapType>(MapType.Standard);

  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>({
    latitude: 30.543024962216446,
    longitude: 104.06439575294166,
  });

  useEffect(() => {
    AMapSdk.init('e10d14fadb21e1cfdfa2d6a73041a81c');
    requestLocationPermission();

    return () => {
      isMounted.current = false;
      mapViewRef.current = null;
    };
  }, []);

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
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 }
    );
  };

  const handleLocationSuccess = (coords: GeolocationCoordinates) => {
    if (!isMounted.current) return;
    setStart({ latitude: coords.latitude, longitude: coords.longitude });
  };

  useEffect(() => {
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

  const handleBack = () => {
    setShowMap(false);
    setTimeout(() => navigation.goBack(), 150);
  };

  const refreshPath = () => {
    if (start && end) fetchPath(start, end);
  };

  return (
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
        <Text style={styles.headerText}>当前位置</Text>
      </View>

      {/* 地图 */}
      <View style={styles.map}>
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
            <Marker
              position={start}
              title="我的位置"
              icon={{
                uri: 'https://reactnative.dev/img/pwa/manifest-icon-512.png',
                width: 48,
                height: 48,
              }}
            />
            <Marker position={end} title="目的地" />
            {path.length > 0 && (
              <Polyline
                width={10}
                color="rgba(211,17,69,0.8)"
                points={path}
              />
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
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#d31145',
    paddingHorizontal: 16,
  },
  backBtn: { position: 'absolute', left: 16 },
  headerText: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  map: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Picker 悬浮样式
  pickerContainer: {
    position: 'absolute',
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)', // 半透明
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 100,
  },
  pickerLabel: { color: '#fff', marginRight: 8 },
  picker: { flex: 1, color: '#fff', width: 130 },

  // 刷新按钮
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
});

export default Hotel;
