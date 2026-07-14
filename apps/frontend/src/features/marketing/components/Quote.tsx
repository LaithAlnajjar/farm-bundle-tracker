import { QUOTE } from '@/features/marketing/content/homeContent';
import { NoteCard, PixelAvatar, PixelIcon } from '@/shared/components/farm-ui';

/** A farmer's word, pinned to the dark bark wall, with crew chips below. */
export function Quote() {
  return (
    <section className="border-b-4 border-ink bg-bark">
      <div className="mx-auto max-w-250 px-8 py-19 text-center">
        <NoteCard
          pin
          rotate={-1}
          className="inline-block max-w-190 border-ink p-9 px-11 shadow-drop-8"
        >
          <div className="mb-3.5 flex justify-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <PixelIcon key={index} name="star" size={24} />
            ))}
          </div>
          <p className="font-display text-[30px] leading-[1.2] font-bold text-ink">
            {QUOTE.text}
          </p>
          <div className="mt-5 inline-flex items-center gap-2.5">
            <PixelAvatar name={QUOTE.avatar} size={36} />
            <span className="font-body text-xl text-ink-soft">
              {QUOTE.author} · <span className="text-ink">{QUOTE.farm}</span>
            </span>
          </div>
        </NoteCard>

        <div className="mt-7.5 flex flex-wrap justify-center gap-3">
          {QUOTE.crews.map((crew) => (
            <span
              key={crew}
              className="rounded-sm border-2 border-ink bg-black/20 px-3 py-1.5 font-micro text-[11px] tracking-[1.5px] uppercase text-linen"
            >
              {crew}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
