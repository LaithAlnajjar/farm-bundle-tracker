import { Link } from "react-router";
import { ChunkyButton } from "@/shared/components/farm-ui";
import type { SubmitEvent } from "react";

export type AuthFormValues = {
  email: string;
  password: string;
};

type AuthFormProps = {
  alternateAction: {
    href: string;
    label: string;
    text: string;
  };
  error?: string;
  isPending: boolean;
  onSubmit: (values: AuthFormValues) => void;
  pendingLabel: string;
  passwordAutoComplete?: "current-password" | "new-password";
  submitLabel: string;
  title: string;
};

export function AuthForm({
  alternateAction,
  error,
  isPending,
  onSubmit,
  pendingLabel,
  passwordAutoComplete = "current-password",
  submitLabel,
  title,
}: AuthFormProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    onSubmit({ email, password });
  }

  return (
    <main className="dot-grid flex min-h-screen items-center justify-center px-6 py-12">
      <section className="parchment w-full max-w-md border-3 border-wood/40 p-8 shadow-pixel-lg">
        <h1 className="mb-6 font-pixel text-[38px] leading-none tracking-[0.04em] text-foreground">
          {title}
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block" htmlFor="email">
            <span className="mb-1.5 block font-body text-sm font-bold text-secondary">
              Email
            </span>
            <input
              autoComplete="email"
              className="w-full border-2 border-wood/40 bg-parchment px-3 py-2 font-body text-base text-foreground outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
              id="email"
              name="email"
              required
              type="email"
            />
          </label>

          <label className="block" htmlFor="password">
            <span className="mb-1.5 block font-body text-sm font-bold text-secondary">
              Password
            </span>
            <input
              autoComplete={passwordAutoComplete}
              className="w-full border-2 border-wood/40 bg-parchment px-3 py-2 font-body text-base text-foreground outline-none focus:border-primary focus:ring-3 focus:ring-primary/20"
              id="password"
              minLength={8}
              name="password"
              required
              type="password"
            />
          </label>

          {error && (
            <p className="border-2 border-destructive/40 bg-destructive/10 px-3 py-2 font-body text-sm font-bold text-destructive">
              {error}
            </p>
          )}

          <ChunkyButton className="w-full" disabled={isPending} type="submit">
            {isPending ? pendingLabel : submitLabel}
          </ChunkyButton>
        </form>

        <p className="mt-6 font-body text-sm font-bold text-secondary">
          {alternateAction.text}{" "}
          <Link
            className="text-primary underline-offset-4 hover:underline"
            to={alternateAction.href}
          >
            {alternateAction.label}
          </Link>
        </p>
      </section>
    </main>
  );
}
