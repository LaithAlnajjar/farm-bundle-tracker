import type { ReactNode } from 'react';

/** Centered pixel section title flanked by short rules, with an optional subtitle. */
export function SectionHeading({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-11 text-center">
      <div className="mb-2.5 flex items-center justify-center gap-3.5">
        <span aria-hidden className="h-0.5 w-12 bg-wood/30" />
        <h2 className="m-0 font-pixel text-[40px] leading-none tracking-[0.04em] text-foreground">
          {children}
        </h2>
        <span aria-hidden className="h-0.5 w-12 bg-wood/30" />
      </div>
      {subtitle && (
        <p className="m-0 font-body text-[15px] font-semibold text-secondary">{subtitle}</p>
      )}
    </div>
  );
}
