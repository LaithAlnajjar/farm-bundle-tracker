import type { RefreshSessionResponse } from '@/features/auth/types';
import { apiClient } from '@/shared/lib/http/apiClient';

export async function refreshSession(): Promise<RefreshSessionResponse> {
  return apiClient.post<RefreshSessionResponse>('/auth/refresh', undefined, {
    auth: false,
    retryOnUnauthorized: false,
  });
}
