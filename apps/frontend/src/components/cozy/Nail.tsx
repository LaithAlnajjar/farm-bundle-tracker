import { cn } from '@/lib/utils';

/** Decorative metal nail head for the corners of wooden frames. */
export function Nail({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute z-[5] size-2.5 rounded-full border border-black/35',
        'bg-[radial-gradient(circle_at_38%_38%,#d4c4a8,#8a7660)]',
        'shadow-[0_1px_3px_rgb(0_0_0_/_0.4),inset_0_1px_0_rgb(255_255_255_/_0.2)]',
        className,
      )}
    />
  );
}
