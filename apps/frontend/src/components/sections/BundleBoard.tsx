import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/cozy/SectionHeading';
import { WoodBoard } from '@/components/cozy/WoodBoard';
import { NoteCard } from '@/components/cozy/NoteCard';
import { Slot } from '@/components/cozy/Slot';
import { SeasonTag } from '@/components/cozy/SeasonTag';
import { ProgressBar } from '@/components/cozy/ProgressBar';
import { toneText } from '@/lib/tones';
import { BUNDLE_LEGEND, CRAFTS_ROOM_BUNDLES } from '@/content/home';
import type { Bundle } from '@/types/home';

const GRID_COLS: Record<number, string> = {
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

function BundleNote({ bundle }: { bundle: Bundle }) {
  const collected = bundle.items.filter((item) => item.done).length;
  const total = bundle.items.length;
  const pct = total > 0 ? Math.round((collected / total) * 100) : 0;

  return (
    <NoteCard
      headerLabel={bundle.headerLabel}
      tone={bundle.tone}
      pin={bundle.pin}
      rotate={bundle.rotate}
    >
      <SeasonTag season={bundle.season} />

      <div className={cn('my-2.5 grid gap-[7px]', GRID_COLS[bundle.columns])}>
        {bundle.items.map((item) => (
          <Slot key={item.label ?? item.emoji} item={item} />
        ))}
      </div>

      <ProgressBar
        value={collected}
        max={total}
        tone={bundle.tone}
        label={`${bundle.headerLabel}: ${collected} of ${total} collected`}
      />

      <div className="mt-[7px] flex justify-between font-body text-[11px] font-bold text-secondary">
        <span>
          {collected} / {total} collected
        </span>
        <span className={toneText[bundle.tone]}>{pct}%</span>
      </div>
    </NoteCard>
  );
}

/** Preview of a Community Center room and its bundles on a wooden board. */
export function BundleBoard() {
  const collected = CRAFTS_ROOM_BUNDLES.reduce(
    (sum, bundle) => sum + bundle.items.filter((item) => item.done).length,
    0,
  );
  const total = CRAFTS_ROOM_BUNDLES.reduce((sum, bundle) => sum + bundle.items.length, 0);

  return (
    <section id="bundles" className="px-6 py-[72px]">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading subtitle="Your board always knows what's left">
          The bundle board
        </SectionHeading>

        <WoodBoard>
          <div className="mb-6 text-center font-pixel text-[15px] tracking-[0.18em] text-gold [text-shadow:1px_1px_0_rgb(0_0_0_/_0.4)]">
            ══ CRAFTS ROOM ══
          </div>

          <div className="mb-[22px] grid gap-6 md:grid-cols-3">
            {CRAFTS_ROOM_BUNDLES.map((bundle) => (
              <BundleNote key={bundle.id} bundle={bundle} />
            ))}
          </div>

          <div className="parchment flex items-center gap-3.5 border-2 border-wood/40 px-4 py-3">
            <span className="font-pixel text-[14px] tracking-[0.04em] whitespace-nowrap text-foreground">
              Crafts Room:
            </span>
            <div className="flex-1">
              <ProgressBar
                value={collected}
                max={total}
                tone="primary"
                label={`Crafts Room: ${collected} of ${total} items`}
              />
            </div>
            <span className="font-body text-[12px] font-bold whitespace-nowrap text-secondary">
              {collected} / {total} items
            </span>
          </div>

          <ul className="mt-3.5 flex list-none flex-wrap justify-center gap-[18px] p-0">
            {BUNDLE_LEGEND.map((entry) => (
              <li key={entry.label} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'flex size-3.5 items-center justify-center border-[1.5px] font-body font-extrabold',
                    entry.badge ? 'rounded-full text-[8px]' : 'rounded-none text-[9px]',
                    entry.swatchClassName,
                  )}
                >
                  {entry.glyph}
                </span>
                <span className="font-body text-[11px] font-bold text-secondary">
                  {entry.label}
                </span>
              </li>
            ))}
          </ul>
        </WoodBoard>
      </div>
    </section>
  );
}
