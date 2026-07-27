import { Link } from "react-router";
import { PixelIcon, seasonOnDark, UserBadge } from "@/shared/components/farm-ui";
import { cn } from "@/shared/lib/utils";
import { roomIcon } from "../lib/boardIcons";
import type { BoardItem, FarmBoard } from "../types/board.types";

/** How many portraits fit before the rest collapse into a "+n" tile. */
const VISIBLE_MEMBERS = 5;

export function BoardSidebar({
  board,
  activeRoomSlug,
  myClaims,
  onSelectRoom,
}: {
  board: FarmBoard;
  activeRoomSlug: string;
  myClaims: BoardItem[];
  onSelectRoom: (slug: string) => void;
}) {
  const { completed, total } = board.progress;
  const claimedRooms = new Set(myClaims.map((item) => item.room.slug));
  const members = board.claimableMembers;
  const overflow = members.length - VISIBLE_MEMBERS;

  return (
    <div className="flex h-full flex-col bg-bark">
      <div className="flex items-center gap-3 border-b-3 border-ink px-5 py-4">
        <Link
          aria-label="All farms"
          className="grid size-9.5 flex-none place-items-center rounded-md border-3 border-ink bg-gold focus-visible:ring-3 focus-visible:ring-gold"
          to="/farms"
        >
          <PixelIcon name="sprout" size={22} />
        </Link>
        <div className="min-w-0">
          <p className="truncate font-display text-xl leading-tight font-bold text-paper">
            {board.farm.name}
          </p>
          <p className="font-body text-base text-linen-dim capitalize">
            {board.farm.membershipRole} ·{" "}
            <span className={seasonOnDark[board.farm.currentSeason]}>
              {board.farm.currentSeason}
            </span>
          </p>
        </div>
        <span
          aria-hidden
          className="ml-auto size-2.75 flex-none animate-ping-dot rounded-[1px] border-2 border-ink bg-leaf-bright"
          title="Live"
        />
      </div>

      <div className="border-b-3 border-ink px-5 py-3.5">
        <div className="mb-1.75 flex items-center gap-2">
          <span className="font-micro text-[10px] tracking-[1.5px] text-linen-dim uppercase">
            Community Center
          </span>
          <span className="ml-auto font-body text-[17px] text-paper">
            {completed}/{total}
          </span>
        </div>
        <div
          aria-label={`${completed} of ${total} bundles stamped`}
          aria-valuemax={total}
          aria-valuemin={0}
          aria-valuenow={completed}
          className="relative h-4 overflow-hidden rounded-[3px] border-2 border-ink-deep bg-ink"
          role="progressbar"
        >
          <div
            className="h-full border-r-2 border-ink-deep bg-harvest transition-[width] duration-300"
            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
          />
        </div>
        <p className="mt-1.5 font-body text-base text-sand">bundles stamped</p>
      </div>

      <nav aria-label="Rooms" className="flex flex-col gap-1.5 overflow-y-auto p-2.5">
        {board.rooms.map((room) => {
          const active = room.slug === activeRoomSlug;
          return (
            <button
              aria-current={active ? "true" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-left focus-visible:ring-3 focus-visible:ring-gold focus-visible:outline-none",
                active
                  ? "border-3 border-ink bg-parchment shadow-drop-3"
                  : "border-3 border-transparent hover:bg-ink/35",
              )}
              key={room.slug}
              onClick={() => onSelectRoom(room.slug)}
              type="button"
            >
              <PixelIcon className="flex-none" name={roomIcon(room.slug)} size={22} />
              <span
                className={cn(
                  "flex-1 truncate",
                  active
                    ? "font-display text-xl font-bold text-ink"
                    : "font-body text-xl text-linen",
                )}
              >
                {room.name}
              </span>
              {claimedRooms.has(room.slug) ? (
                <span
                  aria-label="You have claims here"
                  className={cn(
                    "size-2.25 flex-none rounded-[1px] border-2 bg-gold",
                    active ? "border-ink" : "border-ink-deep",
                  )}
                />
              ) : null}
              <span
                className={cn(
                  "font-body text-[17px]",
                  active ? "text-ink-soft" : "text-sand",
                )}
              >
                {room.progress.completed}/{room.progress.total}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-2.5 border-t-3 border-ink px-5 py-4">
        <div className="flex">
          {members.slice(0, VISIBLE_MEMBERS).map((member, index) => (
            <UserBadge
              className={cn("border-ink", index > 0 && "-ml-2")}
              key={member.membershipId}
              size="sm"
              userId={member.userId}
              username={member.username}
            />
          ))}
          {overflow > 0 ? (
            <span className="-ml-2 grid size-6 place-items-center rounded-[3px] border-2 border-ink bg-soil font-display text-[11px] font-bold text-paper">
              +{overflow}
            </span>
          ) : null}
        </div>
        <span className="font-body text-[17px] text-linen-dim">
          {members.length} {members.length === 1 ? "farmer" : "farmers"}
        </span>
        <Link
          className="ml-auto font-body text-[17px] text-gold underline underline-offset-3 hover:text-paper focus-visible:ring-3 focus-visible:ring-gold"
          to={`/farms/${board.farm.id}/manage`}
        >
          {board.canEdit ? "Invite" : "Members"}
        </Link>
      </div>
    </div>
  );
}
