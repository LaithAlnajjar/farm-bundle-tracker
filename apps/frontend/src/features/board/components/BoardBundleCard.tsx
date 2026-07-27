import { useState } from "react";
import { ChevronDown, ChevronRight, Gift, Sparkles } from "lucide-react";
import { SegmentProgress, StatusBadge } from "@/shared/components/farm-ui";
import type { BoardBundle, BoardMember, BoardSlot } from "../types/board.types";
import { BoardSlotRow } from "./BoardSlotRow";
import { cn } from "@/shared/lib/utils";

export function BoardBundleCard({
  bundle,
  slots,
  canEdit,
  currentMembership,
  members,
  isSlotPending,
  showContext = false,
  onCollect,
  onClaim,
  onRelease,
}: {
  bundle: BoardBundle;
  slots: BoardSlot[];
  canEdit: boolean;
  currentMembership?: BoardMember;
  members: BoardMember[];
  isSlotPending: (slotId: number) => boolean;
  showContext?: boolean;
  onCollect: (slotId: number, collected: boolean) => void;
  onClaim: (slotId: number, membershipId: number) => void;
  onRelease: (slotId: number) => void;
}) {
  const [expanded, setExpanded] = useState(!bundle.progress.complete);
  const active = slots.filter((slot) => slot.needed);
  const secondary = slots.filter((slot) => !slot.needed);

  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border-3 shadow-drop-4 transition-colors",
        bundle.progress.complete
          ? "border-gold-deep bg-gold-soft"
          : "border-bark bg-paper",
      )}
    >
      <button
        aria-expanded={expanded}
        className="flex w-full items-start gap-3 p-4 text-left focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-harvest"
        onClick={() => setExpanded((value) => !value)}
        type="button"
      >
        <span className="mt-1 text-soil">
          {expanded ? <ChevronDown aria-hidden /> : <ChevronRight aria-hidden />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-2xl leading-tight font-bold text-ink">
                {bundle.name}
              </h3>
              <p className="mt-1 inline-flex items-center gap-1.5 font-ui text-xs text-ink-soft">
                <Gift aria-hidden size={14} />
                {bundle.completionReward}
              </p>
            </div>
            <StatusBadge tone={bundle.progress.complete ? "complete" : "needed"}>
              {bundle.progress.complete
                ? "Complete"
                : `${bundle.progress.credited}/${bundle.progress.required}`}
            </StatusBadge>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <SegmentProgress
              label={`${bundle.progress.credited} of ${bundle.progress.required} required slots collected`}
              max={bundle.progress.required}
              value={bundle.progress.credited}
            />
            {bundle.progress.total !== bundle.progress.required ? (
              <span className="shrink-0 font-ui text-xs text-ink-soft">
                {bundle.progress.collected}/{bundle.progress.total} collected
              </span>
            ) : null}
          </div>
        </div>
      </button>

      {expanded ? (
        <div className="border-t-2 border-dashed border-soil/25 p-3 sm:p-4">
          {bundle.progress.complete ? (
            <div className="mb-3 flex items-center gap-2 rounded-lg border-2 border-gold-deep bg-gold p-3 font-ui text-sm font-bold text-gold-ink">
              <Sparkles aria-hidden size={18} />
              Bundle complete · reward unlocked
            </div>
          ) : null}
          {active.length ? (
            <ul className="space-y-2">
              {active.map((slot) => (
                <BoardSlotRow
                  canEdit={canEdit}
                  context={showContext ? bundle.name : undefined}
                  currentMembership={currentMembership}
                  key={slot.id}
                  members={members}
                  onClaim={(membershipId) => onClaim(slot.id, membershipId)}
                  onCollect={(collected) => onCollect(slot.id, collected)}
                  onRelease={() => onRelease(slot.id)}
                  pending={isSlotPending(slot.id)}
                  slot={slot}
                />
              ))}
            </ul>
          ) : null}

          {secondary.length ? (
            <details className={cn(active.length && "mt-3")} open={!active.length}>
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-md px-2 font-display font-bold text-soil hover:bg-parchment">
                <ChevronRight aria-hidden className="details-chevron" size={18} />
                Completed &amp; optional · {secondary.length}
              </summary>
              <ul className="mt-2 space-y-2">
                {secondary.map((slot) => (
                  <BoardSlotRow
                    canEdit={canEdit}
                    context={showContext ? bundle.name : undefined}
                    currentMembership={currentMembership}
                    key={slot.id}
                    members={members}
                    onClaim={(membershipId) => onClaim(slot.id, membershipId)}
                    onCollect={(collected) => onCollect(slot.id, collected)}
                    onRelease={() => onRelease(slot.id)}
                    pending={isSlotPending(slot.id)}
                    slot={slot}
                  />
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
