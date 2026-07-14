import { SEASONS } from '@/features/marketing/content/homeContent';
import {
  PixelIcon,
  SectionHeading,
  seasonPanel,
} from '@/shared/components/farm-ui';
import { cn } from '@/shared/lib/utils';

/** Four season panels showing how the board follows the calendar. */
export function Seasons() {
  return (
    <section
      id="seasons"
      className="scroll-mt-20 border-b-4 border-bark bg-parchment"
    >
      <div className="page-container px-8 py-21">
        <SectionHeading
          kicker="All four, all year"
          subtitle="Grabbable items rise to the top while they're in season, so your crew always knows what to go get right now."
        >
          Your board plays the seasons
        </SectionHeading>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
          {SEASONS.map((panel) => {
            const tones = seasonPanel[panel.season];
            return (
              <div
                key={panel.season}
                className={cn(
                  'rounded-[5px] border-3 p-5 shadow-drop-6',
                  tones.panel,
                )}
              >
                <div className="flex items-center gap-3">
                  <PixelIcon name={panel.icon} size={36} />
                  <span
                    className={cn(
                      'font-display text-[28px] font-bold',
                      tones.title,
                    )}
                  >
                    {panel.title}
                  </span>
                </div>
                <p
                  className={cn(
                    'mt-3 font-body text-xl leading-[1.3]',
                    tones.body,
                  )}
                >
                  {panel.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
