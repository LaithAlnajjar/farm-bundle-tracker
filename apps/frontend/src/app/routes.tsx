import { Route, Routes } from 'react-router';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { HomePage } from '@/features/marketing/pages/HomePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<RegisterPage />} />
    </Routes>
  );
}
