import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { signIn } from '@/features/auth/services';
import type { SignInRequest, SignInResponse } from '@/features/auth/types';
import { setAccessToken } from '@/shared/lib/http/apiClient';

export function useSignIn(
  options?: Pick<
    UseMutationOptions<SignInResponse, Error, SignInRequest>,
    'onError' | 'onSuccess'
  >,
) {
  return useMutation({
    mutationKey: ['auth', 'signin'],
    mutationFn: signIn,
    onError: options?.onError,
    onSuccess: (data, variables, onMutateResult, context) => {
      setAccessToken(data.accessToken);
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
