import { cn } from '@/lib/utils';
import { seasonTag } from '@/lib/tones';
import type { Season } from '@/types/home';

/** Small pixel badge marking which season a bundle belongs to. */
export function SeasonTag({ season }: { season: Season }) {
  const { className, label } = seasonTag[season];

  return (
    <span
      className={cn(
        'inline-block px-[7px] py-0.5 font-pixel text-[11px] tracking-[0.06em] text-parchment',
        className,
      )}
    >
      {label}
    </span>
  );
}
