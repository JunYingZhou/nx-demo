import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  Alert,
  BackHandler,
} from 'react-native';
import { MapView, Marker, AMapSdk, Polyline } from 'react-native-amap3d';
import { useNavigation } from '@react-navigation/native';

// 坐标类型定义
interface Coordinate {
  latitude: number;
  longitude: number;
}

interface CameraPosition {
  target: Coordinate;
  zoom: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Hotel: React.FC = () => {
  const navigation = useNavigation();
  const mapViewRef = useRef<any>(null); // 用于引用 MapView 实例

  // 初始化高德地图 SDK 和调试日志
  // useEffect(() => {
  //   // 初始化 AMapSdk
  //   AMapSdk.init(
  //     Platform.select({
  //       android: '5b76d1ddf6de5a5d652e4928c7fc86ab',
  //       ios: '5b76d1ddf6de5a5d652e4928c7fc86ab',
  //     }),
  //   );
  //   console.log('AMapSdk 初始化完成', mapViewRef);

  //   // 打印导航状态
  //   console.log('Navigation State:', navigation.getState());
  //   console.log('Can go back:', navigation.canGoBack());

  //   // 清理逻辑
  //   return () => {
  //     console.log('Hotel 页面卸载，清理高德地图资源');
  //     // 清理 AMapSdk（如果 SDK 提供销毁方法，需查阅文档）
  //     // AMapSdk.destroy(); // 示例，需确认是否有此 API
  //     if (mapViewRef.current) {
  //       // 尝试暂停或销毁 MapView（视 SDK 支持情况）
  //       mapViewRef.current = null; // 清除引用
  //     }
  //   };
  // }, [navigation]);


  // 检查 MapView 是否可用
  if (!MapView) {
    return (
      <View style={styles.container}>
        <Text style={styles.fallbackText}>地图组件加载失败</Text>
      </View>
    );
  }

  // 检查 Marker 是否可用
  if (!Marker) {
    console.error('Marker 未定义，请检查 react-native-amap3d 版本或导入方式');
    console.log(
      '当前 react-native-amap3d 导出:',
      Object.keys(require('react-native-amap3d')),
    );
    return (
      <View style={styles.container}>
        <Text style={styles.fallbackText}>
          Load Failed, please check react-native-amap3d version or import method
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/image/app-white.png')}
          style={{ width: 26, height: 26 }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.map}>
        <MapView
          ref={mapViewRef} // 绑定 MapView 引用
          style={styles.map}
          initialCameraPosition={{
            target: {
              latitude: 22.2866,
              longitude: 114.1917,
            },
            zoom: 15,
          }}
          showsLocationButton={true}
          showsCompass={true}
          showsScale={true}
          onLoad={() => console.log('地图加载完成: AIA Tower marker 已渲染')}
          onError={(error: any) => console.error('地图加载错误:', error)}
          onPress={({
            nativeEvent,
          }: {
            nativeEvent: { latitude: number; longitude: number };
          }) =>
            console.log(
              '地图点击坐标:',
              nativeEvent.latitude,
              nativeEvent.longitude,
            )
          }
        >
          <Marker
            position={{ latitude: 22.292214, longitude: 114.180777 }}
            onPress={() => console.log('Marker 点击')}
          />
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    backgroundColor: '#d31145',
    paddingHorizontal: 16,
  },
  map: {
    flex: 1,
  },
  introduce: {
    backgroundColor: '#d31145',
    height: 200,
  },
  fallbackText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
    margin: 20,
  },
});

export default Hotel;