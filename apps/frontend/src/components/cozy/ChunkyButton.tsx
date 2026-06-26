import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const chunkyButtonVariants = cva(
  'inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-none px-[26px] py-[9px] font-pixel text-xl leading-none tracking-[0.06em] transition-transform active:translate-x-[3px] active:translate-y-[3px]',
  {
    variants: {
      variant: {
        primary:
          'border-[3px] border-primary-edge bg-primary text-primary-foreground shadow-[5px_5px_0_var(--color-primary-edge)] active:shadow-[2px_2px_0_var(--color-primary-edge)]',
        secondary:
          'border-[3px] border-wood bg-parchment text-foreground shadow-[5px_5px_0_rgb(61_43_31_/_0.35)] active:shadow-[2px_2px_0_rgb(61_43_31_/_0.4)]',
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
