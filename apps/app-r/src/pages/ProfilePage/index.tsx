import { useAuth } from "../../hooks/useAuth";

export function ProfilePage() {
  const { isAuthenticated, setIsAuthenticated, setToken, setRefreshToken, setUser, logout } = useAuth();

  return (
    <div>
      <h2>个人中心</h2>
      {isAuthenticated ? (
        <>
          <p>已登录</p>
          <button onClick={() => {
            logout();
          }}>退出登录</button>
        </>
      ) : (
        <>
          <p>未登录</p>
          <button onClick={() => {
            setIsAuthenticated(true);
            setToken('token');
            setRefreshToken('refreshToken');
            setUser('user');
          }}>登录</button>
        </>
      )}
    </div>
  );
}