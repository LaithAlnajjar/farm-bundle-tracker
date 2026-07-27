import { cn } from '@/shared/lib/utils';
import type { IconName } from './farmUi.types';

/**
 * A 16×16 game sprite rendered with nearest-neighbor scaling.
 * Keep `size` a whole multiple of the sprite for crisp pixels (16/32/48).
 */
export function PixelIcon({
  name,
  size = 24,
  alt = '',
  className,
}: {
  name: IconName;
  size?: number;
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src={`/assets/icons/${name}.png`}
      alt={alt}
      width={size}
      height={size}
      className={cn('pixelated inline-block', className)}
    />
  );
}
