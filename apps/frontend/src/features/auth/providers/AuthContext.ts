import { createContext } from 'react';
import type { AuthUser, SignInRequest, SignInResponse } from '@/features/auth/types';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type AuthContextValue = {
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  signIn: (values: SignInRequest) => Promise<SignInResponse>;
  status: AuthStatus;
  user: AuthUser | null;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
