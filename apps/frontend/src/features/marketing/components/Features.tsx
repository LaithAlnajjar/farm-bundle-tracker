import { FEATURES } from '@/features/marketing/content/homeContent';
import type {
  FeatureFrame,
  FeatureIcon,
} from '@/features/marketing/types/home.types';
import {
  PixelAvatar,
  PixelIcon,
  SectionHeading,
} from '@/shared/components/farm-ui';
import { cn } from '@/shared/lib/utils';

const SPRITE_BOX: Record<FeatureFrame, string> = {
  harvest: 'border-harvest bg-paper',
  leaf: 'border-leaf bg-leaf-soft',
  fall: 'border-fall bg-fall-soft',
  soil: 'border-soil bg-parchment',
  winter: 'border-winter bg-winter-soft',
};

function FeatureIconBox({ icon }: { icon: FeatureIcon }) {
  if (icon.kind === 'live') {
    return (
      <div className="flex size-13 animate-live-pulse items-center justify-center rounded-sm border-3 border-harvest bg-paper">
        <span
          aria-hidden
          className="size-4 animate-ping-dot border-2 border-leaf-dark bg-leaf-bright"
        />
      </div>
    );
  }
  if (icon.kind === 'avatar') {
    return (
      <div className="flex size-13 items-center justify-center rounded-sm border-3 border-harvest bg-paper">
        <PixelAvatar name={icon.avatar} size={34} className="border-2" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        'flex size-13 items-center justify-center rounded-sm border-3',
        SPRITE_BOX[icon.frame],
      )}
    >
      <PixelIcon name={icon.icon} size={30} />
    </div>
  );
}

/** Feature grid pinned straight onto the cork wall. */
export function Features() {
  return (
    <section
      id="features"
      className="cork scroll-mt-20 border-b-4 border-bark"
    >
      <div className="page-container px-8 py-21">
        <SectionHeading
          kicker="Built for the way your farm plays"
          align="left"
          onDark
        >
          Everything happens on the board
        </SectionHeading>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5.5">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[5px] border-3 border-bark bg-paper p-6 pb-5.5 shadow-drop-6"
            >
              <FeatureIconBox icon={feature.icon} />
              <div className="mt-3.5 font-display text-[25px] font-bold text-ink">
                {feature.title}
              </div>
              <p className="mt-1.5 font-body text-xl leading-[1.3] text-ink-soft">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
