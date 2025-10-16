import { View, Text } from 'react-native';
import { MapView, MapTypes, Geolocation } from 'react-native-amap3d';
import { useState } from 'react';
import { Polyline } from 'react-native-amap3d';


const Index = () => {
  const [location, setLocation] = useState<any>(null);
  useEffect(() => {
    getLocation();
    watchLocation();
  }, []);
  getLocation = async () => {
    Geolocation.getCurrentPosition(({ coords }) => {
      console.log('当前定位信息：', coords);
     }, (error) => {
      console.error('定位失败：', error);
     });
  }

  watchLocation = async () => {
    Geolocation.watchPosition(({ coords }) => {
      console.log('当前定位信息：', coords);
     }, (error) => {
      console.error('定位失败：', error);
     });
  }

  return (
    <View>
      <Text>My</Text>
    </View>
  );
};

export default Index;