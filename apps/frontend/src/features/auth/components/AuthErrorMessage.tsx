type AuthErrorMessageProps = {
  message?: string;
};

export function AuthErrorMessage({ message }: AuthErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      className="flex items-start gap-2.5 rounded-sm border-3 border-berry bg-berry-mist px-3.5 py-2.5 font-body text-lg leading-snug text-berry-ink shadow-drop-2"
      role="alert"
    >
      <span
        aria-hidden
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[3px] border-2 border-berry-ink bg-berry font-display text-sm font-bold text-paper"
      >
        !
      </span>
      <span>{message}</span>
    </p>
  );
}
