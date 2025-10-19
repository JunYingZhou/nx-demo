import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { baseURL, headers, timeout } from '../networking/config';
import { resInterceptor } from './interceptors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Config {
  baseURL: string;
  headers: Record<string, string>;
}

interface ResponseInterceptor {
  onFulfill: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onReject: (error: any) => any;
}

export class NetworkService {
  private client: AxiosInstance;

  constructor(config: { baseURL?: string; headers?: Record<string, string>; timeout?: number } = {}) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: headers,
      timeout: timeout,
    });

    this.client.interceptors.response.use(resInterceptor.onFulfill, resInterceptor.onReject);

    this.client.interceptors.request.use(
      (config) => {
        console.log('Request config:', config);
        console.log('Authorization header:', config.headers.Authorization);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );
  }

  setAccessToken(token: string): void {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('setAccessToken', this.client.defaults.headers);
  }

  async clearAccessToken(): Promise<void> {
    delete this.client.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('token');
    console.log('clearAccessToken', this.client.defaults.headers.common['Authorization']);
  }
  

  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    console.log('client', this.client);

    // 从 AsyncStorage 获取 token
    const token = await AsyncStorage.getItem('token');
    // 创建新的 config 对象，避免修改原始 config
    const modifiedConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: token ? `Bearer ${token}` : undefined,
        maxBodyLength: Infinity,
      },
    };

    console.log('Request config with Authorization:', modifiedConfig);
    return this.client.request<T>(modifiedConfig);
  }

  async get<T = any>(url: string, params?: any): Promise<T> {
    console.log('get log', url);
    return this.request<T>({ method: 'GET', url, params });
  }

  async post<T = any>(url: string, data?: any): Promise<T> {
    console.log('post log', url, data);
    return this.request<T>({ method: 'POST', url, data });
  }

  async put<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  async delete<T = any>(url: string): Promise<T> {
    return this.request<T>({ method: 'DELETE', url });
  }
}

export const networkService = new NetworkService();