import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  ScrollView,
  Platform,
  PermissionsAndroid 
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import PushNotification from "react-native-push-notification";
import NotificationService from "../utils/NotificationService";

import RootNavigator from '../navigation/RootNavigator';
import SignNavigator from '../navigation/SignNaigator';
import signInStore from '../store/signInStore';

export const App = () => {
  const scrollViewRef = useRef<null | ScrollView>(null);
  const [isShow, setIsShow] = useState<boolean>(false);
  const isSign = signInStore(state => state.isSign); // 订阅状态
 useEffect(() => {
  NotificationService.init()
  }, []);

  // 发送本地通知函数
  const sendLocalTestNotification = () => {
    PushNotification.localNotification({
      channelId: "default-channel-id", // Android 必填
      title: "测试通知",
      message: "这是一个本地通知，不依赖 Firebase",
      playSound: true,
      soundName: "default",
      vibrate: true,
      vibration: 300,
      ignoreInForeground: false, // iOS 前台也显示
    });
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        { isSign === true ? <RootNavigator /> : <SignNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  scrollView: { backgroundColor: '#ffffff' },
  // 你原来的样式保留，按需扩展
});

export default App;
