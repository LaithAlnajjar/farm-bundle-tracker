import { useNavigate } from 'react-router';
import { AuthForm } from '@/features/auth/components/AuthForm';
import { useSignIn } from '@/features/auth/hooks';

export function SignInPage() {
  const navigate = useNavigate();
  const signInMutation = useSignIn({
    onSuccess: () => navigate('/'),
  });

  return (
    <AuthForm
      alternateAction={{
        href: '/register',
        label: 'Create one',
        text: 'Need an account?',
      }}
      error={signInMutation.error?.message}
      isPending={signInMutation.isPending}
      onSubmit={(values) => signInMutation.mutate(values)}
      pendingLabel="Signing in..."
      submitLabel="Sign in"
      title="Sign in"
    />
  );
}
