import { cn } from '@/shared/lib/utils';

/** Bundle progress as a row of stamped segments — one block per slot. */
export function SegmentProgress({
  value,
  max,
  label,
  className,
}: {
  value: number;
  max: number;
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label ?? `${value} of ${max} collected`}
      className={cn('flex gap-0.75', className)}
    >
      {Array.from({ length: max }, (_, index) => (
        <span
          key={index}
          className={cn(
            'h-3.25 w-4 border-2 border-bark',
            index < value ? 'bg-leaf' : 'bg-parchment',
          )}
        />
      ))}
    </div>
  );
}
