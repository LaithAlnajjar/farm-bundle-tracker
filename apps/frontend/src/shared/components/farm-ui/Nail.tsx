import { cn } from '@/shared/lib/utils';

/** Decorative metal nail head for the corners of wooden frames. */
export function Nail({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'nail-head pointer-events-none absolute z-5 size-2.5 rounded-full border border-black/35',
        className,
      )}
    />
  );
}
