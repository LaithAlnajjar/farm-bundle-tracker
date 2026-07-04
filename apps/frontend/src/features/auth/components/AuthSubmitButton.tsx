import { ChunkyButton } from '@/shared/components/farm-ui';

type AuthSubmitButtonProps = {
  isPending: boolean;
  label: string;
  pendingLabel: string;
};

export function AuthSubmitButton({
  isPending,
  label,
  pendingLabel,
}: AuthSubmitButtonProps) {
  return (
    <ChunkyButton
      className="mt-1 w-full tracking-normal disabled:cursor-not-allowed disabled:opacity-75"
      disabled={isPending}
      type="submit"
    >
      {isPending ? pendingLabel : label}
    </ChunkyButton>
  );
}
