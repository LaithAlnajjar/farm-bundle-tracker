import { ChunkyButton } from '@/components/cozy/ChunkyButton';
import { NoticeBoard } from '@/components/sections/NoticeBoard';
import { HERO_QUICK_FACTS } from '@/content/home';

/** Landing hero: headline copy on the left, notice board on the right. */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-[3px] border-wood/20 px-6 pt-[68px] pb-[60px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 size-[500px] rounded-full bg-[radial-gradient(circle,rgb(220_190_100_/_0.18)_0%,transparent_65%)]"
      />

      <div className="mx-auto grid max-w-[1120px] items-center gap-14 md:grid-cols-[1fr_1.05fr]">
        <div>
          <div className="mb-[22px] inline-flex items-center gap-2 border-2 border-primary-edge bg-primary px-3.5 py-1 font-pixel text-[14px] tracking-[0.1em] text-primary-foreground shadow-[3px_3px_0_rgb(45_64_40_/_0.4)]">
            <span aria-hidden>🌱</span> Community Center Companion
          </div>

          <h1 className="mb-[18px] font-pixel text-[54px] leading-[1.12] tracking-[0.02em] text-foreground">
            Track every bundle
            <br />
            with your
            <br />
            farm friends.
          </h1>

          <p className="mb-[34px] max-w-[400px] font-body text-[17px] font-medium leading-[1.78] text-ink-soft">
            Create a farm, invite your farmhands, and mark bundle items as collected —
            together. No spreadsheets. No guessing who brought the parsnips.
          </p>

          <div className="mb-9 flex flex-wrap gap-3.5">
            <ChunkyButton variant="primary">▶ Start Tracking</ChunkyButton>
            <ChunkyButton variant="secondary">👥 Create Shared Farm</ChunkyButton>
          </div>

          <div className="flex flex-wrap gap-5 border-t-2 border-dashed border-wood/30 pt-[22px]">
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
