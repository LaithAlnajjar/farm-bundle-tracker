import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * Section kicker + pixel display title.
 * `onDark` switches the palette for sections on cork or bark.
 */
export function SectionHeading({
  kicker,
  children,
  subtitle,
  align = 'center',
  onDark = false,
}: {
  kicker: string;
  children: ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  onDark?: boolean;
}) {
  return (
    <div className={cn('mb-10', align === 'center' && 'text-center')}>
      <div
        className={cn(
          'font-micro text-[11px] tracking-[2.5px] uppercase',
          onDark ? 'text-shadow-kicker text-gold' : 'text-berry',
        )}
      >
        {kicker}
      </div>
      <h2
        className={cn(
          'mt-3 font-display text-[46px] leading-[1.05] font-bold',
          onDark ? 'text-shadow-board text-paper' : 'text-ink',
        )}
      >
        {children}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-1.5 font-body text-[22px] leading-[1.3]',
            align === 'center' && 'mx-auto max-w-160',
            onDark ? 'text-linen' : 'text-ink-soft',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
