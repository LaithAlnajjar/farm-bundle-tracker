import { Navigate, useSearchParams } from "react-router";
import {
  AuthLayout,
  AuthLoadingScreen,
  RegisterForm,
} from "@/features/auth/components";
import { useAuth, useRegister } from "@/features/auth/hooks";

export function RegisterPage() {
  const { isAuthenticated, status } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedRedirect = searchParams.get("redirect");
  const redirectPath =
    requestedRedirect?.startsWith("/") === true &&
    !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/farms";
  const registerMutation = useRegister();

  if (status === "loading") {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (registerMutation.isSuccess) {
    return (
      <Navigate
        to={`/signin?redirect=${encodeURIComponent(redirectPath)}`}
        replace
      />
    );
  }

  return (
    <AuthLayout
      alternateAction={{
        href: `/signin?redirect=${encodeURIComponent(redirectPath)}`,
        label: "Sign in",
        text: "Already have an account?",
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
