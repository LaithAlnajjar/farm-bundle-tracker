import { HOW_IT_WORKS } from '@/features/marketing/content/homeContent';
import type { StepFrame } from '@/features/marketing/types/home.types';
import {
  Pin,
  PixelAvatar,
  PixelIcon,
  SectionHeading,
} from '@/shared/components/farm-ui';
import { cn } from '@/shared/lib/utils';

const ICON_BOX: Record<StepFrame, string> = {
  bark: 'border-bark bg-parchment',
  harvest: 'border-harvest bg-paper',
  leaf: 'border-leaf bg-leaf-soft',
  gold: 'border-gold-deep bg-gold-fill',
};

/** Four pinned step cards; the last one goes gold for the payoff. */
export function HowItWorks() {
  return (
    <section
      id="how"
      className="scroll-mt-20 border-b-4 border-bark bg-parchment"
    >
      <div className="page-container px-8 py-21">
        <SectionHeading kicker="Four little steps">
          How a bundle gets done
        </SectionHeading>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
          {HOW_IT_WORKS.map((step) => {
            const golden = step.frame === 'gold';
            return (
              <div
                key={step.number}
                className={cn(
                  'relative rounded-[5px] border-3 p-5.5 pt-6.5',
                  golden
                    ? 'border-gold-deep bg-gold-soft shadow-drop-gold-6'
                    : 'border-bark bg-paper shadow-drop-6',
                )}
              >
                <Pin className="left-6 ml-0" />
                <span
                  className={cn(
                    'font-micro text-[11px] tracking-[2px]',
                    golden ? 'text-gold-deep' : 'text-sand',
                  )}
                >
                  {step.number}
                </span>
                <div
                  className={cn(
                    'relative my-3.5 flex size-14 items-center justify-center rounded-sm border-3',
                    ICON_BOX[step.frame],
                  )}
                >
                  <PixelIcon
                    name={step.icon}
                    size={30}
                    className={cn(golden && 'animate-star-spin')}
                  />
                  {step.claimedBy && (
                    <PixelAvatar
                      name={step.claimedBy}
                      size={26}
                      className="absolute -right-2.25 -bottom-2.25 border-2"
                    />
                  )}
                </div>
                <div
                  className={cn(
                    'font-display text-[26px] font-bold',
                    golden ? 'text-gold-ink' : 'text-ink',
                  )}
                >
                  {step.title}
                </div>
                <p
                  className={cn(
                    'mt-2 font-body text-xl leading-[1.3]',
                    golden ? 'text-gold-ink' : 'text-ink-soft',
                  )}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
