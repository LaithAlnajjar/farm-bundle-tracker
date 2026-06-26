import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BundleItem } from '@/types/home';

type SlotSize = 'sm' | 'md';

const SIZE: Record<SlotSize, { box: string; check: number; label: string }> = {
  sm: { box: 'size-[26px] text-[13px]', check: 10, label: 'max-w-[32px]' },
  md: { box: 'size-9 text-lg', check: 14, label: 'max-w-[42px]' },
};

/** A single collectible slot: emoji, completion state and assignee badge. */
export function Slot({ item, size = 'md' }: { item: BundleItem; size?: SlotSize }) {
  const { emoji, label, done, assigned } = item;
  const sizing = SIZE[size];

  return (
    <div className="flex flex-col items-center gap-[3px]">
      <div
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-none border-2 leading-none',
          sizing.box,
          done
            ? 'border-primary bg-slot-done shadow-[inset_1px_1px_0_rgb(255_255_255_/_0.4),2px_2px_0_rgb(74_103_65_/_0.2)]'
            : 'border-wood/45 bg-slot shadow-[inset_1px_1px_0_rgb(255_255_255_/_0.3),2px_2px_0_rgb(61_43_31_/_0.12)]',
        )}
      >
        <span className="relative z-[1] leading-none">{emoji}</span>

        {done && (
          <span className="absolute inset-0 z-[2] flex items-center justify-center bg-[rgb(74_103_65_/_0.52)]">
            <Check size={sizing.check} strokeWidth={3} className="text-white" />
          </span>
        )}

        {assigned && !done && (
          <span className="absolute -right-0.5 -bottom-0.5 z-[3] flex size-3 items-center justify-center rounded-full border-[1.5px] border-parchment bg-winter font-body text-[7px] font-extrabold text-parchment">
            {assigned}
          </span>
        )}
      </div>

      {label && (
        <span
          className={cn(
            'text-center font-body text-[9px] font-bold leading-tight text-wood',
            sizing.label,
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}
