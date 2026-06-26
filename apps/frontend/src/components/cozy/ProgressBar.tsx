import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { barFillByTone } from '@/lib/tones';
import type { ProgressTone } from '@/types/home';

/** Pixel-striped progress bar built on the shadcn Progress primitive. */
export function ProgressBar({
  value,
  max,
  tone,
  className,
  label,
}: {
  value: number;
  max: number;
  tone: ProgressTone;
  className?: string;
  label?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <Progress
      value={pct}
      aria-label={label}
      className={cn(
        'h-3 rounded-none border-2 border-wood/35 bg-track p-0',
        'shadow-[inset_1px_1px_0_rgb(0_0_0_/_0.08)]',
        '[&>[data-slot=progress-indicator]]:rounded-none',
        barFillByTone[tone],
        className,
      )}
    />
  );
}
