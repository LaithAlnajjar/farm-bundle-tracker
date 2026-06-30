import { cn } from '@/shared/lib/utils';
import { Progress } from '@/shared/components/ui/progress';
import { barFillByTone } from './farmUi.styles';
import type { ProgressTone } from './farmUi.types';

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
        'progress-inset-shadow',
        '[&>[data-slot=progress-indicator]]:rounded-none',
        barFillByTone[tone],
        className,
      )}
    />
  );
}
