import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { toneHeaderBg } from '@/lib/tones';
import { Pin } from '@/components/cozy/Pin';
import type { PinColor, Tone } from '@/types/home';

export interface NoteCardProps {
  headerLabel: string;
  tone: Tone;
  pin?: PinColor;
  /** Tilt in degrees for the pinned-paper look (dynamic value). */
  rotate?: number;
  compact?: boolean;
  className?: string;
  children: ReactNode;
}

/** A parchment note pinned to a board, with a colored title band. */
export function NoteCard({
  headerLabel,
  tone,
  pin,
  rotate = 0,
  compact = false,
  className,
  children,
}: NoteCardProps) {
  return (
    <div
      className={cn('relative origin-top shrink-0', pin && 'pt-3.5', className)}
      // Arbitrary per-note tilt cannot be a static utility class.
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      {pin && <Pin color={pin} />}

      <div className="parchment relative overflow-hidden rounded-none border-2 border-wood/50 shadow-pixel">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-1 z-[1] border border-dashed border-wood/25"
        />

        <div
          className={cn(
            'relative z-[2] border-b border-black/15',
            toneHeaderBg[tone],
            compact ? 'px-2.5 py-1' : 'px-3 py-1.5',
          )}
        >
          <span
            className={cn(
              'block font-pixel tracking-[0.06em] text-parchment',
              compact ? 'text-[13px]' : 'text-[15px]',
            )}
          >
            {headerLabel}
          </span>
        </div>

        <div className={cn('relative z-[2]', compact ? 'px-2.5 py-2' : 'px-3.5 py-3')}>
          {children}
        </div>
      </div>
    </div>
  );
}
