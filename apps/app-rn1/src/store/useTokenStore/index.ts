import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { networkService } from '../../networking/index';
interface State {
  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;
}

const useTokenStore = create<State>((set) => ({
  token: 'no token',

  setToken: async (token: string) => {
    set({ token });
    try {
      console.log('Saving token to AsyncStorage:', token);
      await AsyncStorage.setItem('token', token);
      networkService.setAccessToken(token);
      console.log('Token saved to AsyncStorage', useTokenStore.getState().token);
    } catch (error) {
      console.error('Failed to save token to AsyncStorage:', error);
    }
  },

  clearToken: async () => {
    set({ token: 'no token' });
    try {
      console.log('Removing token from AsyncStorage');
      await AsyncStorage.removeItem('token');
      networkService.clearAccessToken();
    } catch (error) {
      console.error('Failed to remove token from AsyncStorage:', error);
    }
  },
}));

const initializeTokenStore = async () => {
  try {
    const storedToken = await AsyncStorage.getItem('token');
    if (storedToken) {
      useTokenStore.setState({ token: storedToken });
    }
  } catch (error) {
    console.error('Failed to load token from AsyncStorage:', error);
  }
};

initializeTokenStore();

export default useTokenStore;
