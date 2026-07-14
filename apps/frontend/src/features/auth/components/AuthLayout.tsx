import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { BrandMark } from '@/features/marketing/components/BrandMark';
import { NoteCard, chunkyButtonVariants } from '@/shared/components/farm-ui';
import { cn } from '@/shared/lib/utils';

type AuthAlternateAction = {
  href: string;
  label: string;
  text: string;
};

type AuthLayoutProps = {
  alternateAction: AuthAlternateAction;
  children: ReactNode;
  kicker: string;
  subtitle?: string;
  title: string;
};

/** Auth screens are one paper note pinned to the cork wall. */
export function AuthLayout({
  alternateAction,
  children,
  kicker,
  subtitle,
  title,
}: AuthLayoutProps) {
  return (
    <main className="cork min-h-screen">
      <div className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
        <Link to="/" className="mb-7">
          <BrandMark />
        </Link>

        <NoteCard pin className="w-full max-w-120 p-7 shadow-drop-8 sm:p-9">
          <header className="text-center">
            <div className="font-micro text-[11px] tracking-[2.5px] uppercase text-berry">
              {kicker}
            </div>
            <h1 className="mt-2.5 font-display text-[40px] leading-none font-bold text-ink">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 font-body text-xl leading-snug text-ink-soft">
                {subtitle}
              </p>
            ) : null}
          </header>

          <div className="mt-6">{children}</div>

          <div className="seam-dashed mt-7 pt-5 text-center">
            <p className="font-body text-lg text-ink-soft">
              {alternateAction.text}
            </p>
            <Link
              className={cn(
                chunkyButtonVariants({ variant: 'secondary' }),
                'mt-3 px-5 py-2 text-lg',
              )}
              to={alternateAction.href}
            >
              {alternateAction.label}
            </Link>
          </div>
        </NoteCard>
      </div>
    </main>
  );
}
