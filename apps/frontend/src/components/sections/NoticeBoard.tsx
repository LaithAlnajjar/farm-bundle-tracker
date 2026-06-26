import { cn } from '@/lib/utils';
import { WoodBoard } from '@/components/cozy/WoodBoard';
import { NoteCard } from '@/components/cozy/NoteCard';
import { Slot } from '@/components/cozy/Slot';
import { ProgressBar } from '@/components/cozy/ProgressBar';
import {
  HERO_BOILER_PREVIEW,
  HERO_BUNDLE_PREVIEWS,
} from '@/content/home';
import type { BundlePreview } from '@/types/home';

function PreviewNote({
  preview,
  center = false,
}: {
  preview: BundlePreview;
  center?: boolean;
}) {
  const collected = preview.items.filter((item) => item.done).length;
  const total = preview.items.length;

  return (
    <NoteCard
      headerLabel={preview.headerLabel}
      tone={preview.tone}
      pin={preview.pin}
      rotate={preview.rotate}
      compact
    >
      <div className={cn('mb-[7px] flex flex-wrap gap-1', center && 'justify-center')}>
        {preview.items.map((item, index) => (
          <Slot key={index} item={item} size="sm" />
        ))}
      </div>
      <ProgressBar
        value={collected}
        max={total}
        tone={preview.tone}
        label={`${preview.headerLabel}: ${collected} of ${total} collected`}
      />
      <div
        className={cn(
          'mt-1 font-body text-[10px] font-bold text-secondary',
          center && 'text-center',
        )}
      >
        {collected} of {total} collected
      </div>
    </NoteCard>
  );
}

/** The hero's "Community Center" wooden notice board with pinned previews. */
export function NoticeBoard() {
  return (
    <WoodBoard>
      <div className="mb-5 text-center font-pixel text-[13px] tracking-[0.22em] text-gold [text-shadow:1px_1px_0_rgb(0_0_0_/_0.4)]">
        ══ COMMUNITY CENTER ══
      </div>

      <div
        aria-hidden
        className="absolute top-[60px] right-9 left-9 h-0.5 opacity-35 [background:repeating-linear-gradient(90deg,#a07040_0_6px,#c09050_6px_12px)]"
      />

      <div className="mb-5 grid grid-cols-2 gap-[18px]">
        {HERO_BUNDLE_PREVIEWS.map((preview) => (
          <PreviewNote key={preview.id} preview={preview} />
        ))}
      </div>

      <div className="flex justify-center">
        <div className="w-[62%]">
          <PreviewNote preview={HERO_BOILER_PREVIEW} center />
        </div>
      </div>

      <div className="mt-3.5 text-center font-body text-[11px] font-semibold text-tan italic">
        Pelican Town Community Center
      </div>
    </WoodBoard>
  );
}
