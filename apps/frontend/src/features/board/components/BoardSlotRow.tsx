import { LoaderCircle } from "lucide-react";
import { ItemSprite, PixelIcon, UserBadge } from "@/shared/components/farm-ui";
import { formatRelativeTime } from "@/shared/lib/formatDate";
import { cn } from "@/shared/lib/utils";
import { categoryIcon } from "../lib/boardIcons";
import { slotState } from "../lib/boardSelectors";
import type { BoardMember, BoardSlot } from "../types/board.types";

const rowSurface = {
  collected: "border-2 border-leaf bg-leaf-soft",
  claimed: "border-2 border-harvest bg-paper",
  needed: "border-2 border-dashed border-sand bg-parchment",
  optional: "border-2 border-dashed border-sand bg-oat/70",
} as const;

/** Uncollected sprites are dimmed so a full row reads as "done" at a glance. */
const iconTreatment = {
  collected: "",
  claimed: "opacity-85",
  needed: "opacity-40 grayscale-[0.7]",
  optional: "opacity-40 grayscale-[0.7]",
} as const;

const action =
  "inline-flex min-h-8 items-center rounded-[3px] border-2 px-2.5 py-1 font-display text-[15px] font-bold focus-visible:ring-3 focus-visible:ring-gold focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-55";

/** "2 gold-quality" — only rendered when it differs from the plain default. */
function requirementNote(slot: BoardSlot) {
  const parts: string[] = [];
  if (slot.quantity > 1) parts.push(`×${slot.quantity}`);
  if (slot.minimumQuality !== "standard") parts.push(`${slot.minimumQuality}+`);
  return parts.join(" ");
}

export function BoardSlotRow({
  slot,
  canEdit,
  currentMembership,
  pending,
  onCollect,
  onClaim,
  onRelease,
}: {
  slot: BoardSlot;
  canEdit: boolean;
  currentMembership?: BoardMember;
  pending: boolean;
  onCollect: (collected: boolean) => void;
  onClaim: (membershipId: number) => void;
  onRelease: () => void;
}) {
  const state = slotState(slot);
  const mine = slot.claim?.membershipId === currentMembership?.membershipId;
  const requirement = requirementNote(slot);
  const canAct = canEdit && !pending;

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 rounded-[3px] px-3 py-2",
        rowSurface[state],
        pending && "opacity-70",
      )}
    >
      <ItemSprite
        alt=""
        className={cn("flex-none", iconTreatment[state])}
        fallback={categoryIcon(slot.item.category)}
        size={32}
        slug={slot.item.slug}
      />

      <span
        className={cn(
          "font-body text-xl text-ink",
          state === "collected" && "line-through decoration-leaf decoration-2",
        )}
      >
        {slot.item.name}
        {requirement ? (
          <span className="ml-1.5 font-micro text-[9px] tracking-[0.5px] text-soil">
            {requirement}
          </span>
        ) : null}
      </span>

      <span className="min-w-0 truncate font-body text-base text-soil">
        {slot.item.availability.details}
      </span>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {pending ? (
          <LoaderCircle
            aria-hidden
            className="animate-spin text-soil"
            size={18}
          />
        ) : null}

        {slot.collection ? (
          <span className="inline-flex items-center gap-1.5 font-body text-[17px] text-leaf-deep">
            <PixelIcon name="check" size={16} />
            {slot.collection.username} ·{" "}
            {formatRelativeTime(slot.collection.collectedAt)}
          </span>
        ) : null}

        {slot.claim && !slot.collection ? (
          <ClaimPill
            canRelease={canAct && (mine || canEdit)}
            mine={mine}
            onRelease={onRelease}
            username={slot.claim.username}
            userId={slot.claim.userId}
          />
        ) : null}

        {!slot.collection && slot.claimable && currentMembership && (!slot.claim || mine) ? (
          <button
            className={cn(
              action,
              "border-bark bg-paper text-ink shadow-drop-2 hover:bg-gold",
            )}
            disabled={!canAct}
            onClick={() =>
              mine ? onRelease() : onClaim(currentMembership.membershipId)
            }
            type="button"
          >
            {mine ? "Drop claim" : "I'll get this"}
          </button>
        ) : null}

        {canEdit ? (
          <button
            className={cn(
              action,
              slot.collection
                ? "border-sand-strong bg-transparent text-ink-soft hover:border-bark hover:bg-paper"
                : "border-bark bg-harvest text-paper shadow-drop-2 hover:bg-berry",
            )}
            disabled={pending}
            onClick={() => onCollect(!slot.collection)}
            type="button"
          >
            {slot.collection ? "Undo" : "Collect"}
          </button>
        ) : null}
      </div>
    </li>
  );
}

function ClaimPill({
  username,
  userId,
  mine,
  canRelease,
  onRelease,
}: {
  username: string;
  userId: number;
  mine: boolean;
  canRelease: boolean;
  onRelease: () => void;
}) {
  const content = (
    <>
      <UserBadge size="sm" userId={userId} username={username} />
      {mine ? `${username} (you)` : username}
    </>
  );
  const className =
    "inline-flex items-center gap-1.5 rounded-full border-2 border-soil bg-parchment py-0.5 pr-2.5 pl-0.5 font-body text-[17px] text-ink";

  if (!canRelease) {
    return <span className={className}>{content}</span>;
  }

  return (
    <button
      className={cn(
        className,
        "hover:border-berry hover:text-berry focus-visible:ring-3 focus-visible:ring-gold focus-visible:outline-none",
      )}
      onClick={onRelease}
      title={`Release ${username}'s claim`}
      type="button"
    >
      {content}
      <span className="sr-only">Release this claim</span>
    </button>
  );
}
