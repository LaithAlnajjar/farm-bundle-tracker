import { useNavigate } from 'react-router';
import { AuthLayout, SignInForm } from '@/features/auth/components';
import { useSignIn } from '@/features/auth/hooks';

export function SignInPage() {
  const navigate = useNavigate();
  const signInMutation = useSignIn({
    onSuccess: () => navigate('/'),
  });

  return (
    <AuthLayout
      alternateAction={{
        href: '/register',
        label: 'Create one',
        text: 'Need an account?',
      }}
      eyebrow="RETURNING FARMER"
      icon="🏡"
      subtitle="Pick up where your farm left off"
      title="Sign in"
    >
      <SignInForm
        error={signInMutation.error?.message}
        isPending={signInMutation.isPending}
        onSubmit={(values) => signInMutation.mutate(values)}
      />
    </AuthLayout>
  );
}
