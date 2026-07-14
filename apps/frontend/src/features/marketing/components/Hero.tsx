import { Link } from 'react-router';
import { BundleCard } from '@/features/marketing/components/BundleCard';
import {
  HERO,
  HERO_BUNDLE,
  HERO_LIVE_NOTE,
} from '@/features/marketing/content/homeContent';
import {
  NoteCard,
  Pin,
  PixelAvatar,
  PixelIcon,
  chunkyButtonVariants,
} from '@/shared/components/farm-ui';
import { cn } from '@/shared/lib/utils';

/** Landing hero on cork: the big pinned pitch note and a live board collage. */
export function Hero() {
  return (
    <header id="top" className="cork scroll-mt-20 border-b-4 border-bark">
      <div className="page-container flex flex-wrap items-center gap-14 px-8 pt-21 pb-24">
        {/* The pitch, written on a pinned note */}
        <NoteCard className="flex-1 basis-118 p-10 pb-9 shadow-drop-8">
          <Pin className="left-11 ml-0" />
          <div className="font-micro text-[11px] tracking-[2.5px] uppercase text-berry">
            {HERO.kicker}
          </div>
          <h1 className="mt-3.5 font-display text-5xl leading-[1.02] font-bold text-ink sm:text-[60px]">
            {HERO.title}
          </h1>
          <p className="mt-4.5 max-w-130 font-body text-[25px] leading-[1.32] text-ink-soft">
            {HERO.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3.5">
            <Link
              to="/register"
              className={cn(
                chunkyButtonVariants({ variant: 'primary' }),
                'gap-2.5 px-6 py-3.5 text-2xl',
              )}
            >
              <PixelIcon name="sprout" size={24} />
              {HERO.primaryCta}
            </Link>
            <a
              href="#board"
              className={cn(
                chunkyButtonVariants({ variant: 'secondary' }),
                'px-6 py-3.5 text-2xl',
              )}
            >
              {HERO.secondaryCta}
            </a>
          </div>

          <div className="seam-dashed mt-6.5 flex items-center gap-3 pt-4.5">
            <div className="flex">
              {HERO.onlineAvatars.map((avatar, index) => (
                <PixelAvatar
                  key={avatar}
                  name={avatar}
                  size={34}
                  className={cn(index > 0 && '-ml-2.25')}
                />
              ))}
            </div>
            <span className="inline-flex items-center gap-2 font-body text-xl text-ink-soft">
              <span
                aria-hidden
                className="size-2.75 shrink-0 animate-ping-dot border border-leaf-dark bg-leaf"
              />
              {HERO.onlineNote}
            </span>
          </div>
        </NoteCard>

        {/* Collage of the board in action */}
        <div className="relative min-h-118 flex-1 basis-105">
          <div className="absolute top-0 left-2 z-3 inline-flex -rotate-4 items-center gap-2 rounded-sm border-3 border-gold-deep bg-gold-soft px-3 py-1.5 shadow-drop-gold-4">
            <PixelIcon name="star" size={26} className="animate-star-spin" />
            <span className="font-display text-lg font-bold text-gold-ink">
              {HERO.rewardChip}
            </span>
          </div>

          <BundleCard
            bundle={HERO_BUNDLE}
            pin
            rotate={2}
            className="absolute top-11 right-0 z-2 w-79.5 shadow-drop-8"
          />

          <NoteCard
            rotate={-3}
            className="absolute bottom-1.5 left-0 z-4 w-66.5 animate-live-pulse p-3.5 px-4"
          >
            <Pin className="left-auto right-6 ml-0" />
            <div className="flex items-center gap-2.5">
              <PixelAvatar name={HERO_LIVE_NOTE.avatar} size={40} />
              <div className="leading-tight">
                <div className="font-body text-xl text-ink">
                  <span className="font-display font-bold">
                    {HERO_LIVE_NOTE.actor}
                  </span>{' '}
                  {HERO_LIVE_NOTE.action}
                </div>
                <div className="mt-1 font-micro text-[9px] tracking-[1.5px] uppercase text-soil">
                  {HERO_LIVE_NOTE.meta}
                </div>
              </div>
              <div className="relative flex size-10 flex-none items-center justify-center rounded-sm border-3 border-leaf bg-leaf-soft">
                <PixelIcon name={HERO_LIVE_NOTE.icon} size={24} />
                <span
                  aria-hidden
                  className="absolute -top-1.5 -right-1.5 flex size-4.5 items-center justify-center rounded-[3px] border-2 border-bark bg-leaf"
                >
                  <PixelIcon
                    name="check"
                    size={11}
                    className="brightness-[3]"
                  />
                </span>
              </div>
            </div>
          </NoteCard>
        </div>
      </div>
    </header>
  );
}
