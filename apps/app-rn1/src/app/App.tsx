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

export const App = () => {
  const scrollViewRef = useRef<null | ScrollView>(null);
  const [isShow, setIsShow] = useState<boolean>(false);

 useEffect(() => {
  NotificationService.init()
  NotificationService.sendNotification({
      title: "定时提醒",
      message: "5 秒后触发",
      // date: new Date(Date.now() + 5000),
    });
    // Android 13+ 请求通知权限
    // const requestPermission = async () => {
    //   if (Platform.OS === 'android' && Platform.Version >= 33) {
    //     const granted = await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    //     );
    //     console.log('Notification permission:', granted);
    //   }
    // };
    // requestPermission();

    // // 初始化通知
    // PushNotification.configure({
    //   onNotification: (notification) => {
    //     console.log('NOTIFICATION:', notification);
    //   },
    //   requestPermissions: Platform.OS === 'ios',
    // });

    // // 创建渠道
    // PushNotification.createChannel(
    //   {
    //     channelId: 'default-channel-id',
    //     channelName: '默认通知频道',
    //     importance: 4,
    //     vibrate: true,
    //   },
    //   (created) => {
    //     console.log('Channel created:', created);

    //     // 渠道创建完成后发送通知
    //     // PushNotification.localNotification({
    //     //   channelId: 'default-channel-id',
    //     //   title: '测试通知',
    //     //   message: '这是一个本地通知',
    //     //   playSound: true,
    //     //   soundName: 'default',
    //     //   vibrate: true,
    //     //   vibration: 300,
    //     //   ignoreInForeground: false,
    //     // });
    //   }
    // );
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
        {isShow ? <RootNavigator /> : <SignNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  scrollView: { backgroundColor: '#ffffff' },
  // 你原来的样式保留，按需扩展
});

export default App;
