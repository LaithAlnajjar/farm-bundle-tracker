import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

/** A bark-framed cork board surface that paper notes pin onto. */
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
        'overflow-hidden rounded-[7px] border-4 border-bark bg-parchment-deep shadow-drop-10',
        className,
      )}
    >
      <div className={cn('cork-tight p-6', innerClassName)}>{children}</div>
    </div>
  );
}
