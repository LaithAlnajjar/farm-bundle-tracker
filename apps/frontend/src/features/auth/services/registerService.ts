import type { RegisterRequest, RegisterResponse } from '@/features/auth/types';
import { apiClient } from '@/shared/lib/http/apiClient';

export async function register({
  email,
  password,
  username,
}: RegisterRequest): Promise<RegisterResponse> {
  return apiClient.post<RegisterResponse>('/auth/register', {
    email,
    password,
    username,
  });
}
