import { Route, Routes } from 'react-router';
import { RequireAuth } from '@/features/auth/components';
import { RegisterPage, SignInPage } from '@/features/auth/pages';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { HomePage } from '@/features/marketing/pages/HomePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
    </Routes>
  );
}
