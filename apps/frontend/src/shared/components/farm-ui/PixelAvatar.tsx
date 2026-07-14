import { cn } from '@/shared/lib/utils';
import { avatarBg } from './farmUi.styles';
import type { AvatarName } from './farmUi.types';

const NAME_LABEL: Record<AvatarName, string> = {
  abby: 'Abby',
  lena: 'Lena',
  marcus: 'Marcus',
  pia: 'Pia',
  sam: 'Sam',
  theo: 'Theo',
};

/** A pixel farmhand portrait in its framed backdrop. */
export function PixelAvatar({
  name,
  size = 34,
  className,
}: {
  name: AvatarName;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={`/assets/ava-${name}.png`}
      alt={NAME_LABEL[name]}
      width={size}
      height={size}
      className={cn(
        'pixelated rounded-[3px] border-3 border-bark',
        avatarBg[name],
        className,
      )}
    />
  );
}

export { NAME_LABEL as AVATAR_LABELS };
