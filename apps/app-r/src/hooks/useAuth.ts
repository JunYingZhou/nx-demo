import { useAuthStore } from "../store";

export function useAuth() {
  const { isAuthenticated, setIsAuthenticated, setToken, setRefreshToken, setUser, logout } = useAuthStore();
  return { isAuthenticated, setIsAuthenticated, setToken, setRefreshToken, setUser, logout };
}