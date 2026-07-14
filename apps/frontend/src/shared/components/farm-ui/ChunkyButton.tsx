import * as React from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';
import { chunkyButtonVariants } from './farmUi.styles';

export interface ChunkyButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof chunkyButtonVariants> {}

/** Pixel-art chunky button: hard offset shadow that compresses on press. */
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
