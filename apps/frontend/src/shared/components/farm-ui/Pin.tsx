import { cn } from '@/shared/lib/utils';

/**
 * Pixel push-pin holding a note to the board — pinned, never floating.
 * Positioned top-center by default; override via `className`.
 */
export function Pin({ className }: { className?: string }) {
  return (
    <img
      src="/assets/icon-pin.png"
      alt=""
      aria-hidden
      width={24}
      height={24}
      className={cn(
        'pixelated absolute -top-3 left-1/2 z-10 -ml-3',
        className,
      )}
    />
  );
}
