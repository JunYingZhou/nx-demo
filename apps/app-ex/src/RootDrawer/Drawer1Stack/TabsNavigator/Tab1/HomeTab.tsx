import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './HomeScreen';
import { HomeDetailScreen } from './HomeDetailScreen';
import { CameraScreen } from './CameraScreen';
import { AlbumScreen } from './AlbumScreen'
import { MicrophoneScreen } from './MicrophoneScreen'
import { LocationAndMapScreen } from './LocationAndMapScreen';
import { NotificationScreen } from './NotificationScreen';
import { VibrationAndSoundScreen } from './VibrationAndSound';



export function HomeTab() {

  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: "首页" }} />
      <Stack.Screen name="HomeDetail" component={HomeDetailScreen} options={{ title: "详情页" }} />
      <Stack.Screen name="Camera" component={CameraScreen} options={{ title: "相机" }} />
      <Stack.Screen name="Album" component={AlbumScreen} options={{ title: "媒体" }} />
      <Stack.Screen name="Microphone" component={MicrophoneScreen} options={{ title: "麦克风" }} />
      <Stack.Screen name="LocationAndMap" component={LocationAndMapScreen} options={{ title: "定位和地图" }} />
      <Stack.Screen name="Notification" component={NotificationScreen} options={{ title: "通知" }} />
      <Stack.Screen name="VibrationAndSound" component={VibrationAndSoundScreen} options={{ title: "震动和铃声" }} />
    </Stack.Navigator>
  );
}