// store/useNotificationStore.ts
import { create } from 'zustand';

interface NotificationState {
  homeCount: number;
  profileCount: number;
  setHomeCount: (count: number) => void;
  setProfileCount: (count: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  homeCount: 1,
  profileCount: 2,
  setHomeCount: (count: number) => set({ homeCount: count }),
  setProfileCount: (count: number) => set({ profileCount: count }),
}));
