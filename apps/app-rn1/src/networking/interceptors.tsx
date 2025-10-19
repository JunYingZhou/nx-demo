import axios, { AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTokenStore from '../store/useTokenStore';
import useUserStore from '../store/useUserStore';
import { UserSignIn } from "../api/user/index";
import { Alert } from 'react-native';

export const resInterceptor = {
  onFulfill: (response: AxiosResponse) => {
    console.log('Response fulfilled:', response.status, response.data);
    return response.data;
  },

  onReject: async (error: AxiosError) => {
    console.error('Response rejected:', error);

    const errorResponse = {
      message: error.message,
      status: error.response?.status,
      data: error,
    };

    console.log("errorResponse:", errorResponse)

    if (errorResponse.status === 401) {
      try {
        console.log("尝试自动登录...");
        const userEmail = await AsyncStorage.getItem('userEmail');

        console.log("userEmail:", userEmail)

        if (userEmail) {
          await AsyncStorage.removeItem("token");
          const res = await UserSignIn(
            { user_identify: userEmail, user_pwd: '' },
            "https://prod-21.southeastasia.logic.azure.com/workflows/6d3cfd69182f413ebe203aec44998567/triggers/manual/paths/invoke/checkuser?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=2dxp8CR57GAiQcT4s_x1YeuJQZIi3Rf5c4VscbddkZY"
          );

          const { result } = res;
          console.log("自动登录结果:", result);

          if (result?.token && result?.user_info) {
            // 注意这里调用 .getState()，避免在拦截器中直接使用 hooks
            useTokenStore.getState().setToken(result.token);
            await AsyncStorage.setItem("token", result.token);

            await AsyncStorage.setItem("userEmail", userEmail);
            console.log("自动登录成功，已更新用户信息");
          } else {
            // 登录失败，清除状态
            console.warn("自动登录失败，清除用户信息");
            // useUserStore.getState().clearUser();
            // useTokenStore.getState().clearToken();
            await AsyncStorage.removeItem("userEmail");
            await AsyncStorage.removeItem("userPwd");
            await AsyncStorage.removeItem("token");
            console.warn("自动登录失败，已清除用户信息");
          }
        } else {
          console.warn("本地没有缓存用户信息，无法自动登录");
        }
      } catch (e) {
        console.error("处理401时出错", e);
        Alert.alert("Warning", "Please sign in again");
        // useUserStore.getState().clearUser();
        // useTokenStore.getState().clearToken();
      }
    }else{
      // Alert.alert("Error", errorResponse.message);
    }

    return Promise.reject(errorResponse);
  },
};
