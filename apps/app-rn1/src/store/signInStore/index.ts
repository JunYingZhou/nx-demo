import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface State {
  isSign: boolean;
  setSign: (isSign: boolean) => void;
  clearSign: () => void;
}


const signInStore = create<State>(set => ({
  isSign: true,


  setSign: async isSign => {
    set({isSign});
    try {
    //   await AsyncStorage.setItem('isSign', JSON.stringify(isSign));
    } catch (error) {
      console.error('Failed to save isSign to AsyncStorage:', error);
    }
  },

 
  clearSign: async () => {
    set({isSign: false});
    try {
    //   await AsyncStorage.removeItem('isSign');

    } catch (error) {
      console.error('Failed to remove isSign from AsyncStorage:', error);
    }
  },
}));

const initializeStore = async () => {
  try {
    // const userData = await AsyncStorage.getItem('isSign');
    // if (userData) {
    //   signInStore.setState({isSign: JSON.parse(userData)});
    // }
    signInStore.setState({isSign: false});
  } catch (error) {
    console.error('Failed to load isSign from AsyncStorage:', error);
  }
};


initializeStore();

export default signInStore;
