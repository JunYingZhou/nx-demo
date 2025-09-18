import { create } from 'zustand'

interface TokenState {
  token: string
  refreshToken: string
  user: string
  setToken: (token: string) => void
  setRefreshToken: (refreshToken: string) => void
  setUser: (user: string) => void
}

export const useTokenStore = create<TokenState>((set) => ({
  token: '',
  refreshToken: '',
  user: '',
  setToken: (token: string) => set({ token }),
  setRefreshToken: (refreshToken: string) => set({ refreshToken }),
  setUser: (user: string) => set({ user }),
}))
