import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { baseURL, headers } from '../networking/config';
import { networkService } from './NetworkService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const resInterceptor = {
  onFulfill: (response: AxiosResponse) => {
    console.log('Response fulfilled:', response.status, response.data);
    return response.data;
  },
  onReject: (error: AxiosError) => {
    console.error('Response rejected:', error);

    // 确保 data 是对象或 null
    const errorData = error.response?.data ?? null;

    const errorResponse = {
      message: error.message,
      status: error.response?.status ?? 0,
      data: typeof errorData === 'object' ? errorData : { raw: errorData },
    };

    console.log('失败', error, errorResponse);

    if (errorResponse.status === 401) {
      console.log('need to redirect');
      AsyncStorage.removeItem('token');
    }

    return Promise.reject(errorResponse);
  },
};