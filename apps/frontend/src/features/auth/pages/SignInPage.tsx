import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import {
  AuthLayout,
  AuthLoadingScreen,
  SignInForm,
} from "@/features/auth/components";
import { useAuth, useSignIn } from "@/features/auth/hooks";

export function SignInPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, status } = useAuth();
  const requestedRedirect = searchParams.get("redirect");
  const stateLocation = (
    location.state as { from?: { pathname?: string; search?: string } } | null
  )?.from;
  const redirectPath =
    requestedRedirect?.startsWith("/") === true &&
    !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : stateLocation?.pathname
        ? `${stateLocation.pathname}${stateLocation.search ?? ""}`
        : "/farms";
  const signInMutation = useSignIn({
    onSuccess: () => navigate(redirectPath, { replace: true }),
  });

  if (status === "loading") {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate replace to={redirectPath} />;
  }

  return (
    <AuthLayout
      alternateAction={{
        href: `/register?redirect=${encodeURIComponent(redirectPath)}`,
        label: "Create one",
        text: "Need an account?",
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
