import type { AuthUser } from '@/features/auth/types';
import { apiClient } from '@/shared/lib/http/apiClient';

export async function getCurrentUser(): Promise<AuthUser> {
  return apiClient.get<AuthUser>('/auth/me');
}
