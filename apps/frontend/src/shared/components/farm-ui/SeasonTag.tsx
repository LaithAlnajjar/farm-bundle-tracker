import { cn } from '@/shared/lib/utils';
import { seasonTag } from './farmUi.styles';
import type { Season } from './farmUi.types';

/** Small chip marking which season a bundle belongs to. */
export function SeasonTag({
  season,
  suffix,
  className,
}: {
  season: Season;
  /** Extra note after the label, e.g. "now". */
  suffix?: string;
  className?: string;
}) {
  const { chip, dot, label } = seasonTag[season];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[3px] border-2 px-2 py-0.5 font-body text-[15px] leading-tight',
        chip,
        className,
      )}
    >
      <span aria-hidden className={cn('size-2 shrink-0', dot)} />
      {suffix ? `${label} · ${suffix}` : label}
    </span>
  );
}
