import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface State {
  user: any;
  setUser: (user: {name: string; id: number} | null) => void;
  clearUser: () => void;
}


const useUserStore = create<State>(set => ({
  user: {},


  setUser: async user => {
    set({user});
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user to AsyncStorage:', error);
    }
  },

 
  clearUser: async () => {
    set({user: null});
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to remove user from AsyncStorage:', error);
    }
  },
}));

const initializeStore = async () => {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      useUserStore.setState({user: JSON.parse(userData)});
    }
  } catch (error) {
    console.error('Failed to load user from AsyncStorage:', error);
  }
};


initializeStore();

export default useUserStore;
