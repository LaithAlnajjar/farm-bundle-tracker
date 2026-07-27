import type { FarmSeason } from "@/features/farms/types/farm.types";
import { PixelIcon, seasonSurface } from "@/shared/components/farm-ui";
import { cn } from "@/shared/lib/utils";
import { bundleSeasons, slotState } from "../lib/boardSelectors";
import type { LedgerBundle } from "../lib/boardSelectors";
import type { BoardActions, BoardMember } from "../types/board.types";
import { BoardSlotRow } from "./BoardSlotRow";

const pipFill = {
  collected: "bg-leaf",
  claimed: "bg-gold",
  needed: "bg-parchment",
  optional: "bg-oat",
} as const;

function SeasonTag({
  seasons,
  currentSeason,
}: {
  seasons: FarmSeason[];
  currentSeason: FarmSeason;
}) {
  const yearRound = seasons.length === 4 || seasons.length === 0;
  const workableNow = seasons.includes(currentSeason);
  const tint = yearRound
    ? "border-soil bg-parchment text-ink-soft"
    : seasonSurface[workableNow ? currentSeason : seasons[0]!];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[3px] border-2 px-2 py-0.5 font-body text-[15px] leading-tight capitalize",
        tint,
      )}
    >
      {yearRound
        ? "All seasons"
        : `${seasons.join(" · ")}${workableNow ? " · now" : ""}`}
    </span>
  );
}

export function BoardBundleCard({
  entry,
  currentSeason,
  canEdit,
  currentMembership,
  actions,
}: {
  entry: LedgerBundle;
  currentSeason: FarmSeason;
  canEdit: boolean;
  currentMembership?: BoardMember;
  actions: BoardActions;
}) {
  const { bundle, slots, hiddenCount } = entry;
  const { complete, credited, required } = bundle.progress;

  return (
    <article
      className={cn(
        "rounded-md border-3 border-bark",
        complete ? "bg-gold-soft shadow-drop-gold-4" : "bg-paper shadow-drop-4",
      )}
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b-2 border-dashed border-bark/25 px-4.5 py-2.5">
        <h2 className="font-display text-[22px] leading-none font-bold text-ink">
          {bundle.name}
        </h2>

        <SeasonTag
          currentSeason={currentSeason}
          seasons={bundleSeasons(bundle)}
        />

        <span aria-hidden className="ml-1.5 flex gap-0.75">
          {bundle.slots.map((slot) => (
            <span
              className={cn(
                "h-3 w-3.75 border-2 border-bark",
                pipFill[slotState(slot)],
              )}
              key={slot.id}
            />
          ))}
        </span>

        <p className="font-body text-[17px] text-ink-soft">
          {credited} of {required}
        </p>

        {complete ? (
          <span className="inline-flex items-center gap-1.5 rounded-[3px] border-2 border-bark bg-gold px-2.5 py-0.5 font-display text-[15px] font-bold text-ink">
            <PixelIcon className="animate-star-spin" name="star" size={15} />
            Stamped
          </span>
        ) : null}

        <p className="ml-auto inline-flex items-center gap-1.5 font-body text-[17px] text-ink-soft">
          <PixelIcon className="flex-none" name="star" size={18} />
          {bundle.completionReward}
        </p>
      </header>

      <ul className="flex flex-col gap-2 px-4.5 py-2.5">
        {slots.map((slot) => (
          <BoardSlotRow
            canEdit={canEdit}
            currentMembership={currentMembership}
            key={slot.id}
            onClaim={(membershipId) => actions.claim(slot.id, membershipId)}
            onCollect={(collected) => actions.collect(slot.id, collected)}
            onRelease={() => actions.release(slot.id)}
            pending={actions.isSlotPending(slot.id)}
            slot={slot}
          />
        ))}
        {hiddenCount > 0 ? (
          <li className="px-3 font-body text-[17px] text-soil">
            {hiddenCount} more slot{hiddenCount > 1 ? "s" : ""} hidden by this
            filter
          </li>
        ) : null}
      </ul>
    </article>
  );
}
