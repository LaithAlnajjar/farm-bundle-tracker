import { useMutation } from '@tanstack/react-query';
import { register } from '@/features/auth/services';

export function useRegister() {
  return useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: register,
  });
}
