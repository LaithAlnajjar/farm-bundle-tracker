import { useState } from "react";
import { Check, LoaderCircle, MoreHorizontal, UserPlus } from "lucide-react";
import type { BoardMember, BoardSlot } from "../types/board.types";
import type { IconName } from "@/shared/components/farm-ui";
import {
  FarmDialog,
  PixelIcon,
  StatusBadge,
  UserBadge,
} from "@/shared/components/farm-ui";
import { formatDate } from "@/shared/lib/formatDate";
import { cn } from "@/shared/lib/utils";

const categoryIcon: Record<BoardSlot["item"]["category"], IconName> = {
  crops: "parsnip",
  forage: "mushroom",
  fish: "fish",
  artisan_goods: "jar",
  animal_products: "egg",
  minerals_gems: "gem",
  monster_loot: "star",
  cooking_items: "pot",
  tree_products: "logs",
  specialty_items: "sprout",
  currency: "coin",
};

export function BoardSlotRow({
  slot,
  canEdit,
  currentMembership,
  members,
  pending,
  context,
  onCollect,
  onClaim,
  onRelease,
}: {
  slot: BoardSlot;
  canEdit: boolean;
  currentMembership?: BoardMember;
  members: BoardMember[];
  pending: boolean;
  context?: string;
  onCollect: (collected: boolean) => void;
  onClaim: (membershipId: number) => void;
  onRelease: () => void;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const state = slot.collection
    ? "collected"
    : slot.claim
      ? "claimed"
      : slot.needed
        ? "needed"
        : "optional";
  const stateLabel =
    state === "collected"
      ? "Collected"
      : state === "claimed"
        ? "Claimed"
        : state === "needed"
          ? "Needed"
          : "Optional";

  return (
    <li
      className={cn(
        "group rounded-lg border-2 p-3 transition-[background-color,border-color,transform]",
        slot.collection
          ? "border-leaf bg-leaf-soft/80"
          : slot.claim
            ? "border-fall/70 bg-fall-soft/55"
            : slot.needed
              ? "border-sand-strong bg-paper"
              : "border-sand bg-oat/65",
        pending && "opacity-75",
      )}
    >
      <div className="flex items-start gap-3">
        {canEdit ? (
          <button
            aria-label={`${slot.collection ? "Uncollect" : "Collect"} ${slot.item.name}`}
            aria-pressed={Boolean(slot.collection)}
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-md border-3 transition-[transform,background-color] focus-visible:ring-3 focus-visible:ring-harvest",
              slot.collection
                ? "border-leaf-dark bg-leaf text-paper shadow-drop-2"
                : "border-bark bg-paper text-transparent hover:bg-leaf-soft",
            )}
            disabled={pending}
            onClick={() => onCollect(!slot.collection)}
            type="button"
          >
            {pending ? (
              <LoaderCircle aria-hidden className="animate-spin text-ink" size={20} />
            ) : (
              <Check aria-hidden size={22} strokeWidth={3} />
            )}
          </button>
        ) : (
          <span
            aria-label={stateLabel}
            className={cn(
              "grid size-11 shrink-0 place-items-center rounded-md border-3",
              slot.collection
                ? "border-leaf-dark bg-leaf text-paper"
                : "border-soil bg-parchment text-soil",
            )}
          >
            {slot.collection ? (
              <Check aria-hidden size={22} strokeWidth={3} />
            ) : (
              <PixelIcon name={categoryIcon[slot.item.category]} size={22} />
            )}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start gap-2">
            <span className="hidden size-10 shrink-0 items-center justify-center rounded-md border-2 border-soil bg-parchment sm:flex">
              <PixelIcon name={categoryIcon[slot.item.category]} size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <h4 className="font-display text-xl leading-tight font-bold text-ink">
                {slot.item.name}
              </h4>
              <p className="mt-0.5 font-ui text-sm leading-snug text-ink-soft">
                {slot.quantity > 1 ? `${slot.quantity} required` : "1 required"}
                {slot.minimumQuality !== "standard"
                  ? ` · ${slot.minimumQuality} quality`
                  : ""}
              </p>
              {context ? (
                <p className="mt-1 truncate font-ui text-xs text-soil">
                  {context}
                </p>
              ) : null}
            </div>
            <StatusBadge
              className="hidden sm:inline-flex"
              tone={state}
            >
              {stateLabel}
            </StatusBadge>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="font-micro text-[9px] tracking-[0.06em] text-soil uppercase">
              {slot.item.availability.seasons.join(" · ")}
            </span>
            {slot.collection ? (
              <span className="inline-flex items-center gap-1.5 font-ui text-xs font-bold text-leaf-dark">
                <UserBadge
                  size="sm"
                  userId={slot.collection.userId}
                  username={slot.collection.username}
                />
                {slot.collection.username}
              </span>
            ) : slot.claim ? (
              <button
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full pr-2 font-ui text-xs font-bold text-fall-ink hover:bg-fall-soft disabled:cursor-default"
                disabled={!canEdit || pending}
                onClick={() => setDetailsOpen(true)}
                type="button"
              >
                <UserBadge
                  size="sm"
                  userId={slot.claim.userId}
                  username={slot.claim.username}
                />
                {slot.claim.username}
              </button>
            ) : slot.claimable && canEdit && currentMembership ? (
              <button
                className="inline-flex min-h-10 items-center gap-1.5 rounded-md border-2 border-bark bg-harvest px-3 font-display font-bold text-paper shadow-drop-2 hover:translate-y-0.5 hover:shadow-none focus-visible:ring-3 focus-visible:ring-gold"
                disabled={pending}
                onClick={() => onClaim(currentMembership.membershipId)}
                type="button"
              >
                <UserPlus aria-hidden size={16} />
                Claim
              </button>
            ) : null}

            <button
              aria-label={`Details for ${slot.item.name}`}
              className="ml-auto grid size-11 place-items-center rounded-md text-ink-soft hover:bg-parchment focus-visible:ring-3 focus-visible:ring-harvest"
              onClick={() => setDetailsOpen(true)}
              type="button"
            >
              <MoreHorizontal aria-hidden size={20} />
            </button>
          </div>
        </div>
      </div>

      <FarmDialog
        description={`${slot.quantity} required${
          slot.minimumQuality === "standard"
            ? ""
            : ` · ${slot.minimumQuality} quality`
        }`}
        onOpenChange={setDetailsOpen}
        open={detailsOpen}
        title={slot.item.name}
      >
        <div className="space-y-4 font-ui">
          <div className="rounded-lg border-2 border-sand-strong bg-parchment p-3">
            <p className="text-xs font-bold tracking-wide text-soil uppercase">
              Availability
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink">
              {slot.item.availability.details}
            </p>
            <p className="mt-2 text-xs font-bold text-ink-soft capitalize">
              {slot.item.availability.seasons.join(" · ")}
            </p>
          </div>

          {slot.collection ? (
            <div className="flex items-center gap-3 rounded-lg border-2 border-leaf bg-leaf-soft p-3">
              <UserBadge
                userId={slot.collection.userId}
                username={slot.collection.username}
              />
              <div>
                <p className="font-bold text-leaf-dark">
                  Collected by {slot.collection.username}
                </p>
                <p className="text-xs text-ink-soft">
                  {formatDate(slot.collection.collectedAt)}
                </p>
              </div>
            </div>
          ) : null}

          {canEdit && slot.claimable ? (
            <div>
              <p className="mb-2 text-xs font-bold tracking-wide text-soil uppercase">
                Assign to
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {members.map((member) => (
                  <button
                    className={cn(
                      "flex min-h-12 items-center gap-2 rounded-lg border-2 px-3 text-left font-bold",
                      slot.claim?.membershipId === member.membershipId
                        ? "border-harvest bg-gold-soft"
                        : "border-sand-strong bg-paper hover:border-harvest",
                    )}
                    disabled={pending}
                    key={member.membershipId}
                    onClick={() => {
                      onClaim(member.membershipId);
                      setDetailsOpen(false);
                    }}
                    type="button"
                  >
                    <UserBadge
                      size="sm"
                      userId={member.userId}
                      username={member.username}
                    />
                    <span>
                      {member.username}
                      {member.membershipId === currentMembership?.membershipId
                        ? " (you)"
                        : ""}
                    </span>
                  </button>
                ))}
              </div>
              {slot.claim ? (
                <button
                  className="mt-3 min-h-11 font-display font-bold text-berry underline decoration-2 underline-offset-4"
                  disabled={pending}
                  onClick={() => {
                    onRelease();
                    setDetailsOpen(false);
                  }}
                  type="button"
                >
                  Release {slot.claim.username}&apos;s claim
                </button>
              ) : null}
            </div>
          ) : null}

          {canEdit && slot.collection ? (
            <button
              className="min-h-11 rounded-md border-2 border-bark bg-paper px-4 font-display font-bold text-berry"
              disabled={pending}
              onClick={() => {
                onCollect(false);
                setDetailsOpen(false);
              }}
              type="button"
            >
              Uncollect item
            </button>
          ) : null}
        </div>
      </FarmDialog>
    </li>
  );
}
