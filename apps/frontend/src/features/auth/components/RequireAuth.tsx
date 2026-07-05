import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { WoodBoard } from '@/shared/components/farm-ui';
import { useAuth } from '@/features/auth/hooks';

export function AuthLoadingScreen() {
  return (
    <main className="dot-grid flex min-h-screen items-center justify-center px-5 text-foreground">
      <WoodBoard innerClassName="bg-parchment bg-none px-8 py-6 text-center">
        <p className="font-pixel text-2xl text-secondary">Loading farm...</p>
      </WoodBoard>
    </main>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAuthenticated, status } = useAuth();

  if (status === 'loading') {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/signin" />;
  }

  return children;
}
