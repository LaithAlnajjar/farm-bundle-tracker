import { cn } from '@/shared/lib/utils';
import { PixelAvatar } from './PixelAvatar';
import { PixelIcon } from './PixelIcon';
import type { BundleItem } from './farmUi.types';

type SlotSize = 'sm' | 'md';

const SIZE: Record<
  SlotSize,
  { box: string; icon: number; badge: string; badgeIcon: number; avatar: number }
> = {
  sm: {
    box: 'size-13',
    icon: 28,
    badge: 'size-5 -right-1.75 -top-1.75',
    badgeIcon: 12,
    avatar: 24,
  },
  md: {
    box: 'size-16',
    icon: 32,
    badge: 'size-5.5 -right-1.75 -top-1.75',
    badgeIcon: 14,
    avatar: 26,
  },
};

const STATE_BOX = {
  needed: 'border-3 border-dashed border-sand bg-parchment',
  claimed: 'border-3 border-harvest bg-paper',
  collected: 'border-3 border-leaf bg-leaf-soft',
  golden: 'border-3 border-gold-deep bg-gold-fill',
} as const;

/** Item slot — the atom of the board: sprite, state and claim badge. */
export function Slot({
  item,
  size = 'md',
  className,
}: {
  item: BundleItem;
  size?: SlotSize;
  className?: string;
}) {
  const { icon, label, state, claimedBy } = item;
  const sizing = SIZE[size];

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-sm',
        sizing.box,
        STATE_BOX[state],
        className,
      )}
    >
      <PixelIcon
        name={icon}
        alt={label}
        size={sizing.icon}
        className={cn(state === 'needed' && 'opacity-35 grayscale-[0.7]')}
      />

      {state === 'collected' && (
        <span
          aria-hidden
          className={cn(
            'absolute flex items-center justify-center rounded-[3px] border-2 border-bark bg-leaf',
            sizing.badge,
          )}
        >
          <PixelIcon name="check" size={sizing.badgeIcon} className="brightness-[3]" />
        </span>
      )}

      {state === 'claimed' && claimedBy && (
        <PixelAvatar
          name={claimedBy}
          size={sizing.avatar}
          className="absolute -right-2.25 -bottom-2.25 border-2"
        />
      )}
    </div>
  );
}
