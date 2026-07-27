import { BundleCard } from '@/features/marketing/components/BundleCard';
import { LogoSquare } from '@/features/marketing/components/BrandMark';
import {
  BOARD_SHOWCASE,
  SHOWCASE_BUNDLES,
} from '@/features/marketing/content/homeContent';
import {
  Pin,
  PixelAvatar,
  PixelIcon,
  SectionHeading,
  SegmentProgress,
} from '@/shared/components/farm-ui';
import { cn } from '@/shared/lib/utils';

/** Product showcase: the whole app frame with a room of bundle notes. */
export function BundleBoard() {
  const { farmName, farmMeta, onlineAvatars, filters, filterSummary, room } =
    BOARD_SHOWCASE;

  return (
    <section id="board" className="scroll-mt-20 border-b-4 border-bark bg-board">
      <div className="page-container px-8 py-21">
        <SectionHeading
          kicker="The whole thing, one screen"
          subtitle="Every room, bundle and item in one place, whether you're at the desk or out in the field on your phone."
        >
          This is your farm's board
        </SectionHeading>

        {/* App frame */}
        <div className="overflow-hidden rounded-[7px] border-4 border-bark bg-background shadow-drop-10">
          {/* Top bar */}
          <div className="flex flex-wrap items-center gap-4 border-b-4 border-bark bg-soil px-6 py-3.5">
            <div className="flex items-center gap-3">
              <LogoSquare size={38} iconSize={22} />
              <div className="leading-tight">
                <div className="font-display text-2xl font-bold text-paper">
                  {farmName}
                </div>
                <div className="font-body text-[17px] text-linen">
                  {farmMeta}
                </div>
              </div>
            </div>
            <div className="flex-1" />
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-bark bg-black/20 px-3 py-1 font-body text-[17px] text-leaf-soft">
              <span
                aria-hidden
                className="size-2.5 animate-ping-dot bg-leaf-bright"
              />
              Shared
            </span>
            <div className="flex">
              {onlineAvatars.map((avatar, index) => (
                <PixelAvatar
                  key={avatar}
                  name={avatar}
                  size={32}
                  className={cn(index > 0 && '-ml-2.25')}
                />
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-sm border-3 border-bark bg-harvest px-3 py-1.5 font-display text-[17px] font-bold text-paper shadow-drop-3">
              + Invite
            </span>
          </div>

          {/* Filter shelf */}
          <div className="flex flex-wrap items-center gap-2 border-b-3 border-bark bg-paper px-6 py-2.5">
            <span className="mr-0.5 font-micro text-[10px] tracking-[1.5px] uppercase text-soil">
              View
            </span>
            <span className="rounded-sm border-3 border-bark bg-bark px-3 py-1 font-body text-lg text-paper">
              {filters.active}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-sm border-3 border-fall bg-fall-soft px-3 py-1 font-body text-lg text-fall-ink">
              <PixelIcon name="pumpkin" size={18} />
              {filters.inSeason}
            </span>
            <span className="rounded-sm border-3 border-sand-strong bg-paper px-3 py-1 font-body text-lg text-ink">
              {filters.rest}
            </span>
            <div className="flex-1" />
            <span className="font-body text-lg text-soil">{filterSummary}</span>
          </div>

          {/* Cork board with the open room */}
          <div className="cork-tight p-6">
            <div className="relative rounded-[5px] border-4 border-bark bg-paper shadow-drop-6">
              <Pin className="left-8 ml-0" />
              <div className="flex flex-wrap items-center gap-3.5 rounded-t-[2px] border-b-3 border-bark bg-parchment px-5.5 py-3.5">
                <PixelIcon name={room.icon} size={32} />
                <span className="font-display text-[26px] font-bold text-ink">
                  {room.name}
                </span>
                <SegmentProgress
                  value={room.progress.value}
                  max={room.progress.max}
                  className="ml-1"
                />
                <span className="font-body text-[19px] text-ink-soft">
                  {room.progressNote}
                </span>
                <div className="flex-1" />
                <span className="font-body text-lg text-soil">
                  Reward: <span className="text-ink">{room.reward}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-4.5 px-5.5 py-4.5">
                {SHOWCASE_BUNDLES.map((bundle) => (
                  <BundleCard
                    key={bundle.name}
                    bundle={bundle}
                    className="w-80.5"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
