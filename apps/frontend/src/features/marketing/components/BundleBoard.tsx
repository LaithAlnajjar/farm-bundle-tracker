import { BUNDLE_LEGEND, CRAFTS_ROOM_BUNDLES } from '@/features/marketing/content/homeContent';
import type { Bundle } from '@/features/marketing/types/home.types';
import {
  NoteCard,
  ProgressBar,
  SeasonTag,
  SectionHeading,
  Slot,
  toneText,
  WoodBoard,
} from '@/shared/components/farm-ui';
import { cn } from '@/shared/lib/utils';

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

      <div className={cn('my-2.5 grid gap-1.75', GRID_COLS[bundle.columns])}>
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

      <div className="mt-1.75 flex justify-between font-body text-[11px] font-bold text-secondary">
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
    <section id="bundles" className="px-6 py-18">
      <div className="page-container">
        <SectionHeading subtitle="Your board always knows what's left">
          The bundle board
        </SectionHeading>

        <WoodBoard>
          <div className="text-shadow-soft mb-6 text-center font-pixel text-[15px] tracking-[0.18em] text-gold">
            ══ CRAFTS ROOM ══
          </div>

          <div className="mb-5.5 grid gap-6 md:grid-cols-3">
            {CRAFTS_ROOM_BUNDLES.map((bundle) => (
              <BundleNote key={bundle.id} bundle={bundle} />
            ))}
          </div>

          <div className="parchment flex items-center gap-3.5 border-2 border-wood/40 px-4 py-3">
            <span className="font-pixel text-sm tracking-[0.04em] whitespace-nowrap text-foreground">
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
            <span className="font-body text-xs font-bold whitespace-nowrap text-secondary">
              {collected} / {total} items
            </span>
          </div>

          <ul className="mt-3.5 flex list-none flex-wrap justify-center gap-4.5 p-0">
            {BUNDLE_LEGEND.map((entry) => (
              <li key={entry.label} className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'flex size-3.5 items-center justify-center border-1.5 font-body font-extrabold',
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
