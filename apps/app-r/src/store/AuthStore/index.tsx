import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: '',
      isAuthenticated: false,
      refreshToken: '',
      user: '',
      setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
      setToken: (token: string) => set({ token }),
      setRefreshToken: (refreshToken: string) => set({ refreshToken }),
      setUser: (user: string  ) => set({ user }),
      logout: () => set({ token: '', refreshToken: '', user: '', isAuthenticated: false }),
    }),
    { name: 'auth-storage' } // 存在 localStorage
  )
)