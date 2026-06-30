import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { BundleItem } from './farmUi.types';

type SlotSize = 'sm' | 'md';

const SIZE: Record<SlotSize, { box: string; check: number; label: string }> = {
  sm: { box: 'size-6.5 text-[13px]', check: 10, label: 'max-w-8' },
  md: { box: 'size-9 text-lg', check: 14, label: 'max-w-10.5' },
};

/** A single collectible slot: emoji, completion state and assignee badge. */
export function Slot({ item, size = 'md' }: { item: BundleItem; size?: SlotSize }) {
  const { emoji, label, done, assigned } = item;
  const sizing = SIZE[size];

  return (
    <div className="flex flex-col items-center gap-0.75">
      <div
        className={cn(
          'relative flex shrink-0 items-center justify-center rounded-none border-2 leading-none',
          sizing.box,
          done
            ? 'slot-done-shadow border-primary bg-slot-done'
            : 'slot-empty-shadow border-wood/45 bg-slot',
        )}
      >
        <span className="relative z-1 leading-none">{emoji}</span>

        {done && (
          <span className="absolute inset-0 z-2 flex items-center justify-center bg-primary/50">
            <Check size={sizing.check} strokeWidth={3} className="text-white" />
          </span>
        )}

        {assigned && !done && (
          <span className="absolute -right-0.5 -bottom-0.5 z-3 flex size-3 items-center justify-center rounded-full border-1.5 border-parchment bg-winter font-body text-[7px] font-extrabold text-parchment">
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
