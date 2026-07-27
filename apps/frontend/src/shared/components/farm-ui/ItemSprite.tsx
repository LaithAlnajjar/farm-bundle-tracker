import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import type { IconName } from './farmUi.types';

/**
 * The item's own game sprite, looked up by catalog slug. Custom catalogs can
 * carry slugs we have no artwork for, so a missing sprite falls back to the
 * category glyph rather than showing a broken image.
 */
export function ItemSprite({
  slug,
  fallback,
  alt = '',
  size = 26,
  className,
}: {
  slug: string;
  fallback: IconName;
  alt?: string;
  size?: number;
  className?: string;
}) {
  const [missing, setMissing] = useState(false);

  return (
    <img
      src={missing ? `/assets/icons/${fallback}.png` : `/assets/items/${slug}.png`}
      alt={alt}
      width={size}
      height={size}
      onError={() => setMissing(true)}
      className={cn('pixelated inline-block', className)}
    />
  );
}
