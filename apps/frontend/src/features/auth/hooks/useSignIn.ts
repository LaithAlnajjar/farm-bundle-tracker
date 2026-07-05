import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { SignInRequest, SignInResponse } from '@/features/auth/types';
import { useAuth } from './useAuth';

export function useSignIn(
  options?: Pick<
    UseMutationOptions<SignInResponse, Error, SignInRequest>,
    'onError' | 'onSuccess'
  >,
) {
  const { signIn } = useAuth();

  return useMutation({
    mutationKey: ['auth', 'signin'],
    mutationFn: signIn,
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  });
}
