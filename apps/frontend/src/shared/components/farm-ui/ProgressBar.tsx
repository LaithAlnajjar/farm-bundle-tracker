import { cn } from '@/shared/lib/utils';
import { Progress } from '@/shared/components/ui/progress';
import type { ProgressTone } from './farmUi.types';

const FILL: Record<ProgressTone, string> = {
  leaf: '[&>[data-slot=progress-indicator]]:bg-leaf',
  harvest: '[&>[data-slot=progress-indicator]]:bg-harvest',
};

/** Room/farm total progress bar built on the shadcn Progress primitive. */
export function ProgressBar({
  value,
  max,
  tone = 'leaf',
  className,
  label,
}: {
  value: number;
  max: number;
  tone?: ProgressTone;
  className?: string;
  label?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <Progress
      value={pct}
      aria-label={label}
      className={cn(
        'h-4.5 rounded-[3px] border-3 border-bark bg-parchment p-0',
        '[&>[data-slot=progress-indicator]]:rounded-none [&>[data-slot=progress-indicator]]:border-r-3 [&>[data-slot=progress-indicator]]:border-bark',
        FILL[tone],
        className,
      )}
    />
  );
}
