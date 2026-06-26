import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/cozy/SectionHeading';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { toneHeaderBg } from '@/lib/tones';
import { useFarmMode } from '@/hooks/useFarmMode';
import { FARM_MODE_PANELS } from '@/content/home';
import type { FarmMode, FarmModePanel } from '@/types/home';

const ACTIVE_FRAME: Record<FarmModePanel['tone'], string> = {
  primary: 'border-primary shadow-[7px_7px_0_rgb(74_103_65_/_0.28)]',
  winter: 'border-winter shadow-[7px_7px_0_rgb(58_106_138_/_0.28)]',
};

function PanelCard({ panel, active }: { panel: FarmModePanel; active: boolean }) {
  return (
    <div
      className={cn(
        'parchment relative overflow-hidden rounded-none border-[3px] transition-[border-color,box-shadow]',
        active
          ? ACTIVE_FRAME[panel.tone]
          : 'border-wood/30 shadow-[5px_5px_0_rgb(61_43_31/0.14)]',
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[5px] border border-dashed border-wood/20"
      />

      <div
        className={cn(
          'flex items-center gap-2.5 border-b-2 border-black/20 px-[18px] py-[13px]',
          toneHeaderBg[panel.tone],
        )}
      >
        <span aria-hidden className="text-[26px]">
          {panel.icon}
        </span>
        <h3 className="m-0 font-pixel text-2xl tracking-wider text-parchment">
          {panel.title}
        </h3>
      </div>

      <div className="px-5 pt-[18px] pb-[22px]">
        <p className="mb-4 font-body text-[15px] font-medium leading-[1.75] text-ink-soft">
          {panel.body}
        </p>
        <ul className="m-0 flex list-none flex-col gap-[9px] p-0">
          {panel.bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-[9px] font-body text-[14px] font-medium text-ink-soft"
            >
              <span
                className={cn(
                  'mt-px inline-flex size-[18px] shrink-0 items-center justify-center',
                  toneHeaderBg[panel.tone],
                )}
              >
                <Check size={10} strokeWidth={3} className="text-parchment" />
              </span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Solo vs. Shared comparison with a segmented control highlighting a side. */
export function SoloVsCoop() {
  const { mode, setMode, isActive } = useFarmMode('solo');

  return (
    <section
      id="farm"
      className="border-y-[3px] border-wood/20 bg-surface-alt px-6 py-[72px]"
    >
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading subtitle="Works however your farm is set up">
          Solo or co-op — your choice
        </SectionHeading>

        <div className="mb-9 flex justify-center">
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(value) => value && setMode(value as FarmMode)}
            className="gap-0 rounded-none"
          >
            {FARM_MODE_PANELS.map((panel, index) => (
              <ToggleGroupItem
                key={panel.mode}
                value={panel.mode}
                aria-label={panel.title}
                className={cn(
                  'flex-none rounded-none border-2 border-wood-dark bg-tan px-[30px] py-[7px] font-pixel text-xl tracking-[0.07em] text-ink-soft hover:bg-tan hover:text-ink-soft data-[state=on]:bg-foreground data-[state=on]:text-parchment data-[state=on]:shadow-[inset_0_2px_0_rgb(0_0_0_/_0.15)]',
                  index > 0 && '-ml-0.5',
                )}
              >
                {panel.icon} {panel.title}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          {FARM_MODE_PANELS.map((panel) => (
            <PanelCard key={panel.mode} panel={panel} active={isActive(panel.mode)} />
          ))}
        </div>
      </div>
    </section>
  );
}
