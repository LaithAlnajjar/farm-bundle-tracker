import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { Pin } from './Pin';

export interface NoteCardProps {
  /** Render the pixel push-pin at the top edge. */
  pin?: boolean;
  /** Tilt in degrees for the pinned-paper look (dynamic value). */
  rotate?: number;
  className?: string;
  children: ReactNode;
}

/**
 * A paper note pinned to the board: 3px bark border, hard offset shadow.
 * Border color and padding are composable via `className`.
 */
export function NoteCard({
  pin = false,
  rotate = 0,
  className,
  children,
}: NoteCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-[5px] border-3 border-bark bg-paper shadow-drop-6',
        className,
      )}
      // Arbitrary per-note tilt cannot be a static utility class.
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      {pin && <Pin />}
      {children}
    </div>
  );
}
