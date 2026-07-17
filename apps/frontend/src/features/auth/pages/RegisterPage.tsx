import { Navigate } from 'react-router';
import {
  AuthLayout,
  AuthLoadingScreen,
  RegisterForm,
} from '@/features/auth/components';
import { useAuth, useRegister } from '@/features/auth/hooks';

export function RegisterPage() {
  const { isAuthenticated, status } = useAuth();
  const registerMutation = useRegister();

  if (status === 'loading') {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/farms" replace />;
  }

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
      kicker="Starting your farm"
      subtitle="Account details for your bundle board."
      title="Create account"
    >
      <RegisterForm
        error={registerMutation.error?.message}
        isPending={registerMutation.isPending}
        onSubmit={(values) => registerMutation.mutate(values)}
      />
    </AuthLayout>
  );
}
