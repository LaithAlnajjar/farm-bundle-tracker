import { Link } from 'react-router';
import { CTA } from '@/features/marketing/content/homeContent';
import {
  NoteCard,
  PixelIcon,
  chunkyButtonVariants,
} from '@/shared/components/farm-ui';
import { cn } from '@/shared/lib/utils';

/** Positions and colors for the confetti pixels on the closing note. */
const CONFETTI = [
  'top-6.5 left-6.5 size-2.25 bg-berry',
  'top-13 left-13 size-1.75 bg-winter',
  'top-7.5 right-8.5 size-2.25 bg-spring',
  'right-15 bottom-10 size-1.75 bg-summer',
];

/** Closing call-to-action: one last note pinned to the cork. */
export function CallToAction() {
  return (
    <section id="start" className="cork scroll-mt-20 border-b-4 border-bark">
      <div className="page-container flex justify-center px-8 py-23">
        <NoteCard
          pin
          className="max-w-170 rounded-md p-12 px-13 text-center shadow-drop-8"
        >
          {CONFETTI.map((confetti) => (
            <span
              key={confetti}
              aria-hidden
              className={cn('absolute', confetti)}
            />
          ))}
          <div className="font-micro text-[11px] tracking-[2.5px] uppercase text-berry">
            {CTA.kicker}
          </div>
          <h2 className="mt-3.5 font-display text-5xl leading-[1.05] font-bold text-ink">
            {CTA.title}
          </h2>
          <p className="mx-auto mt-3.5 max-w-115 font-body text-[23px] leading-[1.3] text-ink-soft">
            {CTA.description}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3.5">
            <Link
              to="/register"
              className={cn(
                chunkyButtonVariants({ variant: 'primary' }),
                'gap-2.5 px-6.5 py-3.5 text-2xl',
              )}
            >
              <PixelIcon name="sprout" size={24} />
              {CTA.primaryCta}
            </Link>
            <a
              href="#board"
              className={cn(
                chunkyButtonVariants({ variant: 'secondary' }),
                'px-6.5 py-3.5 text-2xl',
              )}
            >
              {CTA.secondaryCta}
            </a>
          </div>
        </NoteCard>
      </div>
    </section>
  );
}
