import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/cozy/SectionHeading';
import { toneHeaderBg } from '@/lib/tones';
import { FEATURES } from '@/content/home';

/** "How it works" — three parchment feature cards. */
export function Features() {
  return (
    <section
      id="seasons"
      className="border-y-[3px] border-wood/20 bg-surface-alt px-6 py-[72px]"
    >
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading subtitle="Everything you need — nothing you don't">
          How it works
        </SectionHeading>

        <div className="grid gap-[26px] md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article
              key={feature.id}
              className="parchment relative overflow-hidden rounded-none border-[3px] border-wood/40 shadow-pixel-md"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-[5px] border border-dashed border-wood/20"
              />

              <div
                className={cn(
                  'flex items-center gap-3 border-b-2 border-black/20 px-[18px] py-3.5',
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

              <div className="px-[18px] pt-4 pb-5">
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
