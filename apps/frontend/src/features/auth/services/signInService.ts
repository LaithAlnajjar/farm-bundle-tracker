import type { SignInRequest, SignInResponse } from '@/features/auth/types';
import { apiClient } from '@/shared/lib/http/apiClient';

export async function signIn({
  email,
  password,
}: SignInRequest): Promise<SignInResponse> {
  return apiClient.post<SignInResponse>('/auth/signin', { email, password });
}
