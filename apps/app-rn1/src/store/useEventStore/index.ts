import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { networkService } from '../../networking/index';
interface State {
  eventInfo: any;
  setEventInfo: (eventInfo: string) => void;
  clearEventInfo: () => void;
}

const useEventStore = create<State>((set) => ({
  eventInfo: {},

  setEventInfo: async (eventInfo: any) => {
    set({ eventInfo });
    try {
      await AsyncStorage.setItem('eventInfo', JSON.stringify(eventInfo));
    } catch (error) {
      console.error('Failed to save eventInfo to AsyncStorage:', error);
    }
  },

  clearEventInfo: async () => {
    set({ eventInfo: {} });
    try {
      await AsyncStorage.removeItem('eventInfo');
    } catch (error) {
      console.error('Failed to remove eventInfo from AsyncStorage:', error);
    }
  },
}));

const initializeEventInfoStore = async () => {
  try {
    const storedEventInfo = await AsyncStorage.getItem('eventInfo');
    if (storedEventInfo) {
      useEventStore.setState({ eventInfo: storedEventInfo });
    }
  } catch (error) {
    console.error('Failed to load eventInfo from AsyncStorage:', error);
  }
};

initializeEventInfoStore();

export default useEventStore;
