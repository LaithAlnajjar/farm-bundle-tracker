import { Navigate, Route, Routes } from "react-router";
import { RequireAuth } from "@/features/auth/components";
import { RegisterPage, SignInPage } from "@/features/auth/pages";
import { FarmsPage, JoinFarmPage, ManageFarmPage } from "@/features/farms";
import { HomePage } from "@/features/marketing/pages/HomePage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/join/:token" element={<JoinFarmPage />} />
      <Route
        path="/farms"
        element={
          <RequireAuth>
            <FarmsPage />
          </RequireAuth>
        }
      />
      <Route
        path="/farms/:farmId/manage"
        element={
          <RequireAuth>
            <ManageFarmPage />
          </RequireAuth>
        }
      />
      <Route path="/dashboard" element={<Navigate replace to="/farms" />} />
    </Routes>
  );
}
