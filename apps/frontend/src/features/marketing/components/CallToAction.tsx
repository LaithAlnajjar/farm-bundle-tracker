import { CTA_CROPS } from '@/features/marketing/content/homeContent';
import { ChunkyButton, Nail } from '@/shared/components/farm-ui';

/** Closing call-to-action framed like a pinned parchment notice. */
export function CallToAction() {
  return (
    <section id="guide" className="relative overflow-hidden px-6 pt-20 pb-18">
      <div
        aria-hidden
        className="cta-glow pointer-events-none absolute top-1/2 left-1/2 size-175 -translate-x-1/2 -translate-y-1/2 rounded-full"
      />

      <div className="narrow-container relative text-center">
        <div className="mb-7 flex justify-center gap-2.5 text-[26px] tracking-[2px]">
          {CTA_CROPS.map((crop, index) => (
            <span key={index} aria-hidden className="opacity-75">
              {crop}
            </span>
          ))}
        </div>

        <div className="parchment relative rounded-none border-3 border-wood/40 px-10 pt-10.5 pb-9.5 shadow-pixel-lg">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-1.5 border border-dashed border-wood/20"
          />
          <Nail className="top-2.5 left-2.5" />
          <Nail className="top-2.5 right-2.5" />
          <Nail className="bottom-2.5 left-2.5" />
          <Nail className="bottom-2.5 right-2.5" />

          <h2 className="mb-3.5 font-pixel text-[42px] leading-[1.15] tracking-[0.03em] text-foreground">
            Ready to finish the
            <br />
            Community Center?
          </h2>
          <p className="mb-8 font-body text-base font-medium leading-[1.72] text-ink-soft">
            Your farm is waiting. Start tracking bundles solo or share the board with your
            whole crew — setup takes less than a minute.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <ChunkyButton variant="primary">🏠 Create Your Farm</ChunkyButton>
            <ChunkyButton variant="secondary">📖 Browse the Guide</ChunkyButton>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-3">
          <span aria-hidden className="h-0 flex-1 border-t-2 border-dashed border-wood/30" />
          <span aria-hidden className="text-lg opacity-55">
            🌻
          </span>
          <span aria-hidden className="h-0 flex-1 border-t-2 border-dashed border-wood/30" />
        </div>
      </div>
    </section>
  );
}
