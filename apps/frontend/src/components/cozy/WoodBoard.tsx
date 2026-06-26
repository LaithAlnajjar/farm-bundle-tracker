import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Nail } from '@/components/cozy/Nail';

/** A nailed wooden frame wrapping a cork inner surface. */
export function WoodBoard({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div
      className={cn(
        'wood-plank relative rounded-none border-[5px] border-wood-dark p-3.5',
        'shadow-[7px_7px_0_rgb(0_0_0/0.28),inset_0_0_30px_rgb(0_0_0/0.18)]',
        className,
      )}
    >
      <Nail className="top-1.5 left-1.5" />
      <Nail className="top-1.5 right-1.5" />
      <Nail className="bottom-1.5 left-1.5" />
      <Nail className="bottom-1.5 right-1.5" />

      <div
        className={cn(
          'cork relative rounded-none border-2 border-black/20 p-[22px]',
          'shadow-[inset_0_0_30px_rgb(0_0_0/0.16)]',
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
