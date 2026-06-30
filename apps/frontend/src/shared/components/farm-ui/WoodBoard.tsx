import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { Nail } from './Nail';

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
        'wood-plank wood-board-shadow relative rounded-none border-5 border-wood-dark p-3.5',
        className,
      )}
    >
      <Nail className="top-1.5 left-1.5" />
      <Nail className="top-1.5 right-1.5" />
      <Nail className="bottom-1.5 left-1.5" />
      <Nail className="bottom-1.5 right-1.5" />

      <div
        className={cn(
          'cork cork-inset-shadow relative rounded-none border-2 border-black/20 p-5.5',
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
