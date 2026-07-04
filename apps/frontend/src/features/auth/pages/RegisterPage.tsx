import { Navigate } from 'react-router';
import { AuthLayout, RegisterForm } from '@/features/auth/components';
import { useRegister } from '@/features/auth/hooks';

export function RegisterPage() {
  const registerMutation = useRegister();

  if (registerMutation.isSuccess) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <AuthLayout
      alternateAction={{
        href: '/signin',
        label: 'Sign in',
        text: 'Already have an account?',
      }}
      eyebrow="STARTING YOUR FARM"
      icon="📝"
      subtitle="Account details for your bundle board"
      title="Create account"
      tone="accent"
    >
      <RegisterForm
        error={registerMutation.error?.message}
        isPending={registerMutation.isPending}
        onSubmit={(values) => registerMutation.mutate(values)}
      />
    </AuthLayout>
  );
}
