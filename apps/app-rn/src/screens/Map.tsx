import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
  Alert,
  Button,
} from 'react-native';
import { MapView, Marker, Polyline, AMapSdk } from 'react-native-amap3d';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation } from '@react-navigation/native';

interface LatLng {
  latitude: number;
  longitude: number;
}

const Map = () => {
  const mapViewRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(false);
  const [path, setPath] = useState<LatLng[]>([]);
  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(true);
  const navigation = useNavigation();

  const isMounted = useRef(true);

  // 初始化高德 SDK
  useEffect(() => {
    AMapSdk.init('e10d14fadb21e1cfdfa2d6a73041a81c'); // 替换成你自己的 Key
    requestLocationPermission();

    return () => {
      // ✅ 清理：卸载时安全销毁
      isMounted.current = false;
      setShowMap(false);
      if (mapViewRef.current) {
        try {
          mapViewRef.current = null;
        } catch (err) {
          console.warn('MapView cleanup error:', err);
        }
      }
    };
  }, []);

  // 请求定位权限
  const requestLocationPermission = async () => {
    try {
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
    } catch (err) {
      console.warn(err);
      setLoading(false);
    }
  };

  // 获取定位（高精度失败则降级低精度）
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
    const currentPos = { latitude: coords.latitude, longitude: coords.longitude };
    setStart(currentPos);
    setEnd({ latitude: coords.latitude + 0.01, longitude: coords.longitude + 0.01 });
  };

  // 坐标确定后获取路线
  useEffect(() => {
    if (start && end) fetchPath(start, end);
  }, [start, end]);

  // 获取路线
  const fetchPath = async (origin: LatLng, destination: LatLng) => {
    if (fetching || !isMounted.current) return;
    setFetching(true);
    setLoading(true);

    try {
      const response = await fetch(
        `https://restapi.amap.com/v3/direction/driving?key=e10d14fadb21e1cfdfa2d6a73041a81c&origin=${origin.longitude},${origin.latitude}&destination=${destination.longitude},${destination.latitude}`
      );
      const data = await response.json();

      if (data.status !== '1' || !data.route?.paths?.length) {
        Alert.alert('获取路线失败');
        return;
      }

      const steps = data.route.paths[0].steps || [];
      const route: LatLng[] = steps.flatMap((s: any) =>
        s.polyline
          ? s.polyline
              .split(';')
              .map((p: string) => {
                const [lon, lat] = p.split(',');
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);
                if (isNaN(latitude) || isNaN(longitude)) return null;
                return { latitude, longitude };
              })
              .filter(Boolean)
          : []
      );

      if (!isMounted.current) return;
      setPath(route);

      // 安全移动摄像头
      if (mapReady && mapViewRef.current && origin) {
        mapViewRef.current.moveCamera({ target: origin, zoom: 14 });
      }
    } catch (error) {
      console.error(error);
      if (isMounted.current) Alert.alert('路线请求错误');
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setFetching(false);
      }
    }
  };

  // 刷新路线
  const refreshPath = async () => {
    if (!start || !end) return;

    const newStart = { latitude: start.latitude + 0.01, longitude: start.longitude + 0.01 };
    const newEnd = { latitude: end.latitude + 0.0001, longitude: end.longitude + 0.0001 };

    setStart(newStart);
    setEnd(newEnd);

    await fetchPath(newStart, newEnd);
  };

  // 安全返回
  const handleBack = () => {
    // 优先隐藏地图，防止 Android 原生层崩溃
    setShowMap(false);
    setTimeout(() => {
      navigation.goBack();
    }, 150);
  };

  return (
    <View style={styles.container}>
      {/* 顶部栏 */}
      <View style={styles.header}>
        <ImageBackground
          source={require('../assets/image/app-white.png')}
          style={{ width: 26, height: 26 }}
          resizeMode="contain"
        />
        <Text style={styles.headerText} onPress={handleBack}>
          当前位置
        </Text>
      </View>

      {/* 地图区域 */}
      <View style={styles.map}>
        {(!start || !end || loading) ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#d31145" />
            <Text style={{ color: '#333', marginTop: 10 }}>正在加载路线...</Text>
          </View>
        ) : (
          showMap && (
            <MapView
              ref={mapViewRef}
              style={StyleSheet.absoluteFill}
              initialCameraPosition={{ target: start, zoom: 14 }}
              onMapReady={() => {
                setMapReady(true);
                if (mapViewRef.current && start) {
                  mapViewRef.current.moveCamera({ target: start, zoom: 14 });
                }
              }}
            >
              <Marker position={start} title="起点" />
              <Marker position={end} title="终点" />
              {path.length > 0 && <Polyline width={8} color="blue" points={path} />}
            </MapView>
          )
        )}
      </View>

      {/* 刷新按钮 */}
      <View style={{ padding: 12 }}>
        <Button
          title={fetching ? '刷新中…' : '刷新路线'}
          onPress={refreshPath}
          disabled={fetching || !start || !end}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: '#d31145',
    paddingHorizontal: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 8,
  },
  map: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default Map;
