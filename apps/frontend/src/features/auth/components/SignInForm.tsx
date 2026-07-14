import type { SubmitEvent } from "react";
import type { SignInRequest } from "@/features/auth/types";
import { AuthErrorMessage } from "./AuthErrorMessage";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthTextField } from "./AuthTextField";

type SignInFormProps = {
  error?: string;
  isPending: boolean;
  onSubmit: (values: SignInRequest) => void;
};

export function SignInForm({ error, isPending, onSubmit }: SignInFormProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit({
      email: String(formData.get("email") ?? "")
        .trim()
        .toLowerCase(),
      password: String(formData.get("password") ?? ""),
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <AuthTextField
        autoComplete="email"
        id="signin-email"
        label="Email"
        name="email"
        placeholder="farmer@pelican.town"
        required
        type="email"
      />

      <AuthTextField
        autoComplete="current-password"
        id="signin-password"
        label="Password"
        minLength={8}
        name="password"
        placeholder="Password"
        required
        type="password"
      />

      <AuthErrorMessage message={error} />

      <AuthSubmitButton
        isPending={isPending}
        label="Sign in"
        pendingLabel="Signing in..."
      />
    </form>
  );
}
