import type { SubmitEvent } from "react";
import type { RegisterRequest } from "@/features/auth/types";
import { AuthErrorMessage } from "./AuthErrorMessage";
import { AuthSubmitButton } from "./AuthSubmitButton";
import { AuthTextField } from "./AuthTextField";

type RegisterFormProps = {
  error?: string;
  isPending: boolean;
  onSubmit: (values: RegisterRequest) => void;
};

export function RegisterForm({
  error,
  isPending,
  onSubmit,
}: RegisterFormProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    onSubmit({
      email: String(formData.get("email") ?? "")
        .trim()
        .toLowerCase(),
      password: String(formData.get("password") ?? ""),
      username: String(formData.get("username") ?? "")
        .trim()
        .toLowerCase(),
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <AuthTextField
        autoCapitalize="none"
        autoComplete="username"
        icon="👩‍🌾"
        id="register-username"
        label="Username"
        maxLength={32}
        minLength={3}
        name="username"
        pattern="[a-zA-Z0-9_]+"
        placeholder="haley_farm"
        required
        spellCheck={false}
        title="Use 3 to 32 letters, numbers, or underscores."
        type="text"
      />

      <AuthTextField
        autoComplete="email"
        icon="📬"
        id="register-email"
        label="Email"
        name="email"
        placeholder="farmer@pelican.town"
        required
        type="email"
      />

      <AuthTextField
        autoComplete="new-password"
        icon="🔑"
        id="register-password"
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
        label="Create account"
        pendingLabel="Creating..."
      />
    </form>
  );
}
