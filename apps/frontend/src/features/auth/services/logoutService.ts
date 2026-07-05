import { apiClient } from '@/shared/lib/http/apiClient';

export async function logout(): Promise<void> {
  await apiClient.post<void>('/auth/logout', undefined, {
    auth: false,
    retryOnUnauthorized: false,
  });
}
