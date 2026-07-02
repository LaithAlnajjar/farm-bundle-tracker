import { Link } from 'react-router';
import { AuthForm } from '@/features/auth/components/AuthForm';
import { useRegister } from '@/features/auth/hooks';

export function RegisterPage() {
  const registerMutation = useRegister();

  if (registerMutation.isSuccess) {
    return (
      <main className="dot-grid flex min-h-screen items-center justify-center px-6 py-12">
        <section className="parchment w-full max-w-md border-3 border-wood/40 p-8 text-center shadow-pixel-lg">
          <h1 className="mb-3 font-pixel text-[38px] leading-none tracking-[0.04em] text-foreground">
            Account created
          </h1>
          <p className="mb-6 font-body text-base font-bold text-secondary">
            {registerMutation.data.email} is ready to sign in.
          </p>
          <Link className="font-pixel text-xl text-primary hover:underline" to="/signin">
            Go to sign in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <AuthForm
      alternateAction={{
        href: '/signin',
        label: 'Sign in',
        text: 'Already have an account?',
      }}
      error={registerMutation.error?.message}
      isPending={registerMutation.isPending}
      onSubmit={(values) => registerMutation.mutate(values)}
      passwordAutoComplete="new-password"
      pendingLabel="Creating..."
      submitLabel="Create account"
      title="Create account"
    />
  );
}
