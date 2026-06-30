import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const chunkyButtonVariants = cva(
  'inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-none px-6.5 py-2.25 font-pixel text-xl leading-none tracking-[0.06em] transition-transform active:translate-x-0.75 active:translate-y-0.75',
  {
    variants: {
      variant: {
        primary:
          'chunky-primary-shadow active:chunky-primary-shadow-pressed border-3 border-primary-edge bg-primary text-primary-foreground',
        secondary:
          'chunky-secondary-shadow active:chunky-secondary-shadow-pressed border-3 border-wood bg-parchment text-foreground',
        ghost: 'border-2 border-parchment/40 bg-transparent text-parchment',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

export interface ChunkyButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof chunkyButtonVariants> {}

/** Pixel-art chunky button with a tactile pressed state (CSS-only). */
export function ChunkyButton({
  className,
  variant,
  type = 'button',
  ...props
}: ChunkyButtonProps) {
  return (
    <button
      type={type}
      className={cn(chunkyButtonVariants({ variant }), className)}
      {...props}
    />
  );
}
