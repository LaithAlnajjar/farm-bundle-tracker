import { cn } from '@/shared/lib/utils';
import { seasonTag } from './farmUi.styles';
import type { Season } from './farmUi.types';

/** Small pixel badge marking which season a bundle belongs to. */
export function SeasonTag({ season }: { season: Season }) {
  const { className, label } = seasonTag[season];

  return (
    <span
      className={cn(
        'inline-block px-1.75 py-0.5 font-pixel text-[11px] tracking-[0.06em] text-parchment',
        className,
      )}
    >
      {label}
    </span>
  );
}
