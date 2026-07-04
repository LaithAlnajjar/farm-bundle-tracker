type AuthErrorMessageProps = {
  message?: string;
};

export function AuthErrorMessage({ message }: AuthErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className="flex items-start gap-2 border-2 border-destructive/45 bg-destructive/10 px-3 py-2.5 font-body text-sm font-extrabold text-destructive shadow-[3px_3px_0_rgb(200_75_45_/_0.12)]"
      role="alert"
    >
      <span aria-hidden className="leading-5">
        !
      </span>
      <span>{message}</span>
    </p>
  );
}
