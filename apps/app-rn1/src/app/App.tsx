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
import { API_URL, APP_ENV } from '@env';
import { getPrompt } from '../api/home/index'
import axios from 'axios'
import RootNavigator from '../navigation/RootNavigator';
import SignNavigator from '../navigation/SignNaigator';
import signInStore from '../store/signInStore';

export const App = () => {
  const scrollViewRef = useRef<null | ScrollView>(null);
  const [isShow, setIsShow] = useState<boolean>(false);
  const isSign = signInStore(state => state.isSign); // 订阅状态
 useEffect(() => {
  NotificationService.init()
  console.log("1", API_URL, APP_ENV)
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
  useEffect(()=> {

    getPrompt1();
  },[])


  const getPrompt1 = async() => {
    try {
      
    console.log("asdasdaadasda", API_URL)
    // const res = await getPrompt('/prompt', { name: 'Ryan' });
    // axios.get(`${API_URL}/prompt`, { name: 'Ryan' }).then(res => {
    axios
      .get(`http://192.168.31.115:3000/prompt`, {
        params: { name: 'Ryan' }, // ✅ 必须放在 params 里
      })
      .then((res) => {
        console.log('返回结果:', res.data);
      })
      .catch((e) => {
        console.error('请求失败:', e);
      });

        // console.log("asdasda",reshttp://10.0.2.2)
    } catch (error) {
      console.error(error)
      throw error
    }
    }
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
