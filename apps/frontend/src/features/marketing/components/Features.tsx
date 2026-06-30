import { FEATURES } from '@/features/marketing/content/homeContent';
import { SectionHeading, toneHeaderBg } from '@/shared/components/farm-ui';
import { cn } from '@/shared/lib/utils';

/** "How it works" — three parchment feature cards. */
export function Features() {
  return (
    <section
      id="seasons"
      className="border-y-3 border-wood/20 bg-surface-alt px-6 py-18"
    >
      <div className="page-container">
        <SectionHeading subtitle="Everything you need — nothing you don't">
          How it works
        </SectionHeading>

        <div className="grid gap-6.5 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.id}
              className="parchment relative overflow-hidden rounded-none border-3 border-wood/40 shadow-pixel-md"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-1.25 border border-dashed border-wood/20"
              />

              <div
                className={cn(
                  'flex items-center gap-3 border-b-2 border-black/20 px-4.5 py-3.5',
                  toneHeaderBg[feature.tone],
                )}
              >
                <span aria-hidden className="text-[28px] leading-none">
                  {feature.icon}
                </span>
                <h3 className="m-0 font-pixel text-[22px] tracking-[0.05em] text-parchment">
                  {feature.title}
                </h3>
              </div>

              <div className="px-4.5 pt-4 pb-5">
                <p className="mb-3.5 font-body text-[15px] font-medium leading-[1.72] text-ink-soft">
                  {feature.body}
                </p>
                <div className="inline-block border border-wood/25 bg-wood/10 px-2.5 py-1 font-body text-[11px] font-bold tracking-[0.02em] text-secondary">
                  {feature.note}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
