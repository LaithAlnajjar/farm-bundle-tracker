import type {
  BundleChip,
  ShowcaseBundle,
} from '@/features/marketing/types/home.types';
import {
  Pin,
  PixelIcon,
  SeasonTag,
  SegmentProgress,
  Slot,
} from '@/shared/components/farm-ui';
import { cn } from '@/shared/lib/utils';

const FRAME = {
  fall: 'border-fall bg-paper shadow-drop-4',
  gold: 'border-gold-deep bg-gold-soft shadow-drop-gold-4',
  sand: 'border-sand-strong bg-paper shadow-drop-4',
} as const;

function ChipBadge({ chip }: { chip: BundleChip }) {
  if (chip.kind === 'season') {
    return <SeasonTag season={chip.season} suffix={chip.suffix} />;
  }
  if (chip.kind === 'complete') {
    return (
      <span className="inline-flex items-center rounded-[3px] border-2 border-bark bg-gold px-2 py-0.5 font-micro text-[10px] tracking-[1px] uppercase text-ink">
        Complete
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-[3px] border-2 border-soil bg-parchment px-2 py-0.5 font-body text-[15px] text-ink-soft">
      {chip.text}
    </span>
  );
}

/** A pinned bundle note: name, status chip, item slots and reward line. */
export function BundleCard({
  bundle,
  pin = false,
  rotate = 0,
  className,
}: {
  bundle: ShowcaseBundle;
  pin?: boolean;
  rotate?: number;
  className?: string;
}) {
  const {
    name,
    chip,
    frame,
    items,
    overflow,
    slotSize = 'md',
    progress,
    footerNote,
    reward,
  } = bundle;
  const golden = frame === 'gold';

  return (
    <div
      className={cn('relative rounded-[5px] border-3', FRAME[frame], className)}
      // Arbitrary per-note tilt cannot be a static utility class.
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      {pin && <Pin />}
      {golden && (
        <PixelIcon
          name="star"
          size={30}
          className="absolute -top-3.5 -right-2.5 animate-star-spin"
        />
      )}

      <div className="flex items-center gap-2 px-3.5 pt-3 pb-2">
        <span
          className={cn(
            'flex-1 font-display text-[21px] leading-tight font-bold',
            golden ? 'text-gold-ink' : 'text-ink',
          )}
        >
          {name}
        </span>
        <ChipBadge chip={chip} />
      </div>

      <div className="flex flex-wrap gap-2.5 px-3.5 pb-2.5">
        {items.map((item) => (
          <Slot
            key={item.label}
            item={item}
            size={slotSize}
            className={cn(item.live && 'animate-live-pulse')}
          />
        ))}
        {overflow && (
          <div
            className={cn(
              'flex items-center justify-center rounded-sm border-3 border-dashed border-sand bg-parchment font-body text-[19px] text-sand',
              slotSize === 'sm' ? 'size-13' : 'size-16',
            )}
          >
            +{overflow}
          </div>
        )}
      </div>

      <div
        className={cn(
          'flex items-center gap-2 px-3.5 py-2.5',
          golden
            ? 'border-t-2 border-dashed border-gold-deep/40'
            : 'seam-dashed',
        )}
      >
        {progress && (
          <SegmentProgress value={progress.value} max={progress.max} />
        )}
        <span
          className={cn(
            'font-body text-lg',
            golden ? 'text-gold-ink' : 'text-ink',
          )}
        >
          {footerNote}
        </span>
        <div className="flex-1" />
        <span
          className={cn(
            'inline-flex items-center gap-1.5 font-body text-[17px]',
            golden ? 'text-gold-ink' : 'text-ink-soft',
          )}
        >
          <PixelIcon name={reward.icon} size={20} />
          {reward.label}
        </span>
      </div>
    </div>
  );
}
