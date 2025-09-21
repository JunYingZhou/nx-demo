import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout/index";

import { ProfilePage } from "../pages/ProfilePage/index";

import { LoginPage } from "../pages/LoginPage/index";

import { RegisterPage } from "../pages/RegisterPage/index";

import { ForgotPasswordPage } from "../pages/ForgotPasswordPage/index";

import { ResetPasswordPage } from "../pages/ResetPasswordPage/index";
export function Router() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
    </BrowserRouter>
  );
}


