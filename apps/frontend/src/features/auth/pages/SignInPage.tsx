import { Navigate, useLocation, useNavigate } from 'react-router';
import {
  AuthLayout,
  AuthLoadingScreen,
  SignInForm,
} from '@/features/auth/components';
import { useAuth, useSignIn } from '@/features/auth/hooks';

export function SignInPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, status } = useAuth();
  const redirectPath =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? '/farms';
  const signInMutation = useSignIn({
    onSuccess: () => navigate(redirectPath, { replace: true }),
  });

  if (status === 'loading') {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate replace to="/farms" />;
  }

  return (
    <AuthLayout
      alternateAction={{
        href: '/register',
        label: 'Create one',
        text: 'Need an account?',
      }}
      kicker="Returning farmer"
      subtitle="Pick up where your farm left off."
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
