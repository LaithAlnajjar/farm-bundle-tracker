import { BRAND } from '@/features/marketing/content/homeContent';
import { PixelIcon } from '@/shared/components/farm-ui';
import { cn } from '@/shared/lib/utils';

/** Gold logo tile holding the sprout sprite. */
export function LogoSquare({
  size = 42,
  iconSize = 26,
  className,
}: {
  size?: number;
  iconSize?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-sm border-3 border-bark bg-gold shadow-drop-3',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <PixelIcon name="sprout" size={iconSize} />
    </span>
  );
}

/** Logo tile + wordmark + micro tagline, for wooden bars (nav, footer). */
export function BrandMark({
  tagline = BRAND.tagline,
  compact = false,
  className,
}: {
  tagline?: string;
  /** Footer sizing: smaller tile and wordmark. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <LogoSquare
        size={compact ? 38 : 42}
        iconSize={compact ? 22 : 26}
      />
      <span className="leading-none">
        <span
          className={cn(
            'block font-display font-bold text-paper',
            compact ? 'text-[22px]' : 'text-2xl',
          )}
        >
          {BRAND.name}
        </span>
        <span className="mt-0.5 block font-micro text-[9px] tracking-[2px] uppercase text-linen">
          {tagline}
        </span>
      </span>
    </span>
  );
}
