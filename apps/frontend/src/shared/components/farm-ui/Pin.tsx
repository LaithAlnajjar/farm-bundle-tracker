import { cn } from '@/shared/lib/utils';
import { pinBg } from './farmUi.styles';
import type { PinColor } from './farmUi.types';

/** Push-pin holding a note card to the board. */
export function Pin({
  color,
  position = 'top',
}: {
  color: PinColor;
  position?: 'top' | 'bottom';
}) {
  return (
    <span
      aria-hidden
      className={cn(
        'absolute left-1/2 z-10 flex -translate-x-1/2 flex-col items-center',
        position === 'top' ? '-top-3' : '-bottom-3',
      )}
    >
      <span
        className={cn(
          'pin-shadow relative size-3.75 rounded-full border-1.5 border-black/30',
          pinBg[color],
        )}
      >
        <span className="pin-highlight absolute inset-0 rounded-full" />
      </span>
      <span className="h-1.75 w-0.5 bg-black/35" />
    </span>
  );
}
