import { cn } from '@/shared/lib/utils';
import { AVATAR_LABELS } from './avatar.lib';
import type { AvatarName } from './farmUi.types';

/** A villager portrait in its framed backdrop. */
export function PixelAvatar({
  name,
  size = 34,
  alt,
  title,
  className,
}: {
  name: AvatarName;
  size?: number;
  /** Overrides the villager's name when the portrait stands in for someone. */
  alt?: string;
  title?: string;
  className?: string;
}) {
  return (
    <img
      src={`/assets/avatars/${name}.png`}
      alt={alt ?? AVATAR_LABELS[name]}
      title={title}
      width={size}
      height={size}
      className={cn(
        'pixelated rounded-[3px] border-3 border-bark bg-ava-frame',
        className,
      )}
    />
  );
}
