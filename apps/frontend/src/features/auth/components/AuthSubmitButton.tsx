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
    <ChunkyButton className="mt-1 w-full" disabled={isPending} type="submit">
      {isPending ? pendingLabel : label}
    </ChunkyButton>
  );
}
