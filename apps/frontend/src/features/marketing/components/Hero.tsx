import { HERO_QUICK_FACTS } from '@/features/marketing/content/homeContent';
import { NoticeBoard } from '@/features/marketing/components/NoticeBoard';
import { ChunkyButton } from '@/shared/components/farm-ui';

/** Landing hero: headline copy on the left, notice board on the right. */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-3 border-wood/20 px-6 pt-17 pb-15">
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute -top-20 -right-20 size-125 rounded-full"
      />

      <div className="page-container grid items-center gap-14 md:marketing-hero-grid">
        <div>
          <div className="pixel-badge-shadow mb-5.5 inline-flex items-center gap-2 border-2 border-primary-edge bg-primary px-3.5 py-1 font-pixel text-sm tracking-[0.1em] text-primary-foreground">
            <span aria-hidden>🌱</span> Community Center Companion
          </div>

          <h1 className="mb-4.5 font-pixel text-[54px] leading-[1.12] tracking-[0.02em] text-foreground">
            Track every bundle
            <br />
            with your
            <br />
            farm friends.
          </h1>

          <p className="mb-8.5 max-w-100 font-body text-[17px] font-medium leading-[1.78] text-ink-soft">
            Create a farm, invite your farmhands, and mark bundle items as collected —
            together. No spreadsheets. No guessing who brought the parsnips.
          </p>

          <div className="mb-9 flex flex-wrap gap-3.5">
            <ChunkyButton variant="primary">▶ Start Tracking</ChunkyButton>
            <ChunkyButton variant="secondary">👥 Create Shared Farm</ChunkyButton>
          </div>

          <div className="flex flex-wrap gap-5 border-t-2 border-dashed border-wood/30 pt-5.5">
            {HERO_QUICK_FACTS.map((fact) => (
              <div key={fact.stat} className="flex items-center gap-2">
                <span aria-hidden className="text-xl">
                  {fact.icon}
                </span>
                <div>
                  <div className="font-pixel text-base leading-none text-foreground">
                    {fact.stat}
                  </div>
                  <div className="mt-0.5 font-body text-[11px] font-bold text-secondary">
                    {fact.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <NoticeBoard />
      </div>
    </section>
  );
}
