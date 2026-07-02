import { apiClient } from '@/shared/lib/http/apiClient';
import type { RegisterRequest, RegisterResponse } from '@/features/auth/types';

export async function register({ email, password }: RegisterRequest): Promise<RegisterResponse> {
  return apiClient.post<RegisterResponse>('/auth/register', { email, password });
}
