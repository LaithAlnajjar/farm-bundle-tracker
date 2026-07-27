import { cn } from '@/shared/lib/utils';
import type { BundleTone } from './farmUi.types';

/** A Junimo Note bundle pouch — the board's stand-in for a community-center room. */
export function BundleSprite({
  tone,
  size = 32,
  alt = '',
  className,
}: {
  tone: BundleTone;
  size?: number;
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src={`/assets/rooms/bundle-${tone}.png`}
      alt={alt}
      width={size}
      height={size}
      className={cn('pixelated inline-block', className)}
    />
  );
}
