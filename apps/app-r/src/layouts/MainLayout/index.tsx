import { useAuth } from "../../hooks/useAuth";
import { HeaderLayout } from "../HeaderLayout/index";
import { NavigationLayout } from "../NavigationLayout/index";
import { FooterLayout } from "../FooterLayout/index";
import { Outlet } from "react-router-dom";
import { ProfilePage } from "../../pages/ProfilePage/index";
export function MainLayout() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="app-shell">
      <HeaderLayout />
      <NavigationLayout />
      <main className="app-content">
        <div className="container content-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="muted">欢迎使用 AppR</div>
            <span className="badge">{isAuthenticated ? '已登录' : '未登录'}</span>
          </div>
          {/* <Outlet /> */}
          <ProfilePage />
        </div>
      </main>
      <FooterLayout />
    </div>
  );
}