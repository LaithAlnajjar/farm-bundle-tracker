import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getCurrentUser,
  logout as requestLogout,
  refreshSession,
  signIn as requestSignIn,
} from '@/features/auth/services';
import type { AuthUser, SignInRequest } from '@/features/auth/types';
import { clearAccessToken, setAccessToken } from '@/shared/lib/http/apiClient';
import { AuthContext, type AuthContextValue, type AuthStatus } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      try {
        const session = await refreshSession();
        setAccessToken(session.accessToken);
        const currentUser = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        setUser(currentUser);
        setStatus('authenticated');
      } catch {
        clearAccessToken();

        if (isMounted) {
          setUser(null);
          setStatus('unauthenticated');
        }
      }
    }

    void hydrateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const signIn = useCallback(
    async (values: SignInRequest) => {
      const response = await requestSignIn(values);
      setAccessToken(response.accessToken);
      setUser({
        id: response.id,
        email: response.email,
        username: response.username,
      });
      setStatus('authenticated');

      return response;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await requestLogout();
    } finally {
      clearAccessToken();
      setUser(null);
      setStatus('unauthenticated');
      queryClient.clear();
    }
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: status === 'authenticated',
      logout,
      signIn,
      status,
      user,
    }),
    [logout, signIn, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
