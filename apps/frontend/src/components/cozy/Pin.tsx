import { cn } from '@/lib/utils';
import { pinBg } from '@/lib/tones';
import type { PinColor } from '@/types/home';

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
          'relative size-[15px] rounded-full border-[1.5px] border-black/30 shadow-[0_2px_4px_rgb(0_0_0_/_0.4)]',
          pinBg[color],
        )}
      >
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_33%_33%,rgb(255_255_255_/_0.45),transparent_60%)]" />
      </span>
      <span className="h-[7px] w-0.5 bg-black/35" />
    </span>
  );
}
