import { Navigate, Route, Routes } from 'react-router';
import { RequireAuth } from '@/features/auth/components';
import { RegisterPage, SignInPage } from '@/features/auth/pages';
import { FarmsPage } from '@/features/farms';
import { HomePage } from '@/features/marketing/pages/HomePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route
        path="/farms"
        element={
          <RequireAuth>
            <FarmsPage />
          </RequireAuth>
        }
      />
      <Route path="/dashboard" element={<Navigate replace to="/farms" />} />
    </Routes>
  );
}
