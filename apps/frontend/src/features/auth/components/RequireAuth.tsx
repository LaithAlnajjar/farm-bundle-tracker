import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { NoteCard } from '@/shared/components/farm-ui';
import { useAuth } from '@/features/auth/hooks';

export function AuthLoadingScreen() {
  return (
    <main className="cork flex min-h-screen items-center justify-center px-5">
      <NoteCard pin className="px-8 py-6 text-center">
        <p className="inline-flex items-center gap-2.5 font-display text-2xl font-bold text-ink">
          <span
            aria-hidden
            className="size-2.75 shrink-0 animate-ping-dot border border-leaf-dark bg-leaf"
          />
          Loading farm…
        </p>
      </NoteCard>
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
