import { Route, Routes } from 'react-router';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { SignInPage } from '@/features/auth/pages/SignInPage';
import { HomePage } from '@/features/marketing/pages/HomePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signin" element={<SignInPage />} />
    </Routes>
  );
}
