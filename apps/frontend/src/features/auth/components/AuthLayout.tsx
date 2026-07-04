import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { WoodBoard } from '@/shared/components/farm-ui';
import { cn } from '@/shared/lib/utils';

type AuthAlternateAction = {
  href: string;
  label: string;
  text: string;
};

type AuthLayoutTone = 'accent' | 'primary';

type AuthLayoutProps = {
  alternateAction: AuthAlternateAction;
  children: ReactNode;
  eyebrow?: string;
  icon?: string;
  subtitle?: string;
  title: string;
  tone?: AuthLayoutTone;
};

export function AuthLayout({
  alternateAction,
  children,
  eyebrow = 'Farm Account',
  icon = '🌱',
  subtitle,
  title,
  tone = 'primary',
}: AuthLayoutProps) {
  const headerTone =
    tone === 'accent'
      ? 'border-accent/80 bg-accent text-accent-foreground'
      : 'border-primary-edge bg-primary text-primary-foreground';

  return (
    <main className="dot-grid min-h-screen text-foreground">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-6 sm:py-14">
        <section className="relative w-full max-w-120">
          <div className="mb-4 text-center">
            <div className="inline-flex items-center gap-2 font-pixel text-sm text-secondary">
              <span aria-hidden className="opacity-65">
                🌱
              </span>
              <span>{eyebrow}</span>
              <span aria-hidden className="opacity-65">
                🌱
              </span>
            </div>
          </div>

          <WoodBoard
            className="w-full"
            innerClassName="overflow-hidden border-2 border-wood/45 bg-parchment bg-none p-0 shadow-none"
          >
            <div className="parchment relative">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-1.5 z-10 border border-dashed border-wood/20"
              />

              <header
                className={cn(
                  'relative z-20 flex items-center gap-3 border-b-3 px-5 py-3.5 transition-colors sm:px-6',
                  headerTone,
                )}
              >
                <span aria-hidden className="text-[28px] leading-none">
                  {icon}
                </span>
                <div>
                  <h1 className="font-pixel text-[32px] leading-none">
                    {title}
                  </h1>
                  {subtitle ? (
                    <p className="mt-1 font-body text-xs font-extrabold text-current/75">
                      {subtitle}
                    </p>
                  ) : null}
                </div>
              </header>

              <div className="relative z-20 px-5 py-5 sm:px-6 sm:py-6">
                {children}

                <div
                  aria-hidden
                  className="my-6 border-t-2 border-dashed border-wood/25"
                />

                <div className="text-center">
                  <p className="mb-3 font-body text-sm font-extrabold text-secondary">
                    {alternateAction.text}
                  </p>
                  <Link
                    className="chunky-secondary-shadow active:chunky-secondary-shadow-pressed inline-flex items-center justify-center border-3 border-wood bg-parchment px-5 py-1.5 font-pixel text-lg leading-none text-foreground transition-transform hover:-translate-y-0.25 active:translate-x-0.75 active:translate-y-0.75"
                    to={alternateAction.href}
                  >
                    {alternateAction.label}
                  </Link>
                </div>
              </div>
            </div>
          </WoodBoard>
        </section>
      </div>
    </main>
  );
}
