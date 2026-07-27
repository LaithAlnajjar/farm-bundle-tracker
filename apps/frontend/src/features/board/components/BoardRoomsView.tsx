import { Gift, SearchX } from "lucide-react";
import { NoteCard, StatusBadge } from "@/shared/components/farm-ui";
import type {
  BoardActions,
  BoardBundle,
  BoardMember,
  BoardPreferences,
  BoardRoom,
  FarmBoard,
} from "../types/board.types";
import { filterBoardItems, flattenBoard } from "../lib/boardSelectors";
import { BoardBundleCard } from "./BoardBundleCard";
import { BoardFilters } from "./BoardFilters";
import { RoomProgressRail } from "./RoomProgressRail";

export function BoardRoomsView({
  board,
  currentUserId,
  currentMembership,
  preferences,
  actions,
  onChange,
}: {
  board: FarmBoard;
  currentUserId?: number;
  currentMembership?: BoardMember;
  preferences: BoardPreferences;
  actions: BoardActions;
  onChange: (
    patch: Partial<BoardPreferences>,
    options?: { replace?: boolean },
  ) => void;
}) {
  const activeRoom =
    board.rooms.find((room) => room.slug === preferences.room) ?? board.rooms[0];
  const roomSource = preferences.q ? board.rooms : activeRoom ? [activeRoom] : [];
  const items = filterBoardItems({
    items: flattenBoard({ ...board, rooms: roomSource }),
    preferences: { ...preferences, assignee: "all" },
    currentSeason: board.farm.currentSeason,
    currentUserId,
  });
  const visibleRooms = projectRooms(roomSource, new Set(items.map((item) => item.slot.id)));

  return (
    <div className="space-y-5">
      <RoomProgressRail
        activeRoomId={activeRoom?.id}
        onSelect={(room) => onChange({ room: room.slug, q: "" })}
        rooms={board.rooms}
      />

      <BoardFilters
        members={board.claimableMembers}
        onChange={onChange}
        onClear={() =>
          onChange({ q: "", status: "all", season: "current", assignee: "all" })
        }
        preferences={{ ...preferences, assignee: "all" }}
        resultCount={items.length}
      />

      {!preferences.q && activeRoom ? (
        <section className="rounded-xl border-3 border-bark bg-parchment p-4 shadow-drop-3 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-micro text-[9px] tracking-[0.12em] text-soil uppercase">
                Selected room
              </p>
              <h2 className="mt-1 font-display text-4xl font-bold text-ink">
                {activeRoom.name}
              </h2>
              <p className="mt-1 inline-flex items-center gap-1.5 font-ui text-sm text-ink-soft">
                <Gift aria-hidden size={16} /> Reward: {activeRoom.completionReward}
              </p>
            </div>
            <StatusBadge tone={activeRoom.progress.complete ? "complete" : "needed"}>
              {activeRoom.progress.complete
                ? "Room complete"
                : `${activeRoom.progress.completed}/${activeRoom.progress.total} bundles`}
            </StatusBadge>
          </div>
        </section>
      ) : null}

      {visibleRooms.length ? (
        <div className="space-y-6">
          {visibleRooms.map((room) => (
            <section key={room.id}>
              {preferences.q ? (
                <div className="mb-3 flex items-end justify-between gap-3">
                  <h2 className="font-display text-3xl font-bold text-ink">
                    {room.name}
                  </h2>
                  <span className="font-ui text-xs text-ink-soft">
                    Search results
                  </span>
                </div>
              ) : null}
              <div className="grid gap-4 lg:grid-cols-2">
                {room.bundles.map((bundle) => (
                  <BoardBundleCard
                    bundle={bundle}
                    canEdit={board.canEdit}
                    currentMembership={currentMembership}
                    isSlotPending={actions.isSlotPending}
                    key={bundle.id}
                    members={board.claimableMembers}
                    onClaim={actions.claim}
                    onCollect={actions.collect}
                    onRelease={actions.release}
                    slots={bundle.slots}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <NoteCard className="rounded-xl border-3 border-bark bg-paper p-8 text-center shadow-drop-4">
          <SearchX aria-hidden className="mx-auto text-soil" size={34} />
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">
            Nothing matches
          </h2>
          <p className="mt-1 font-ui text-sm text-ink-soft">
            Try a different season, status, room, or search term.
          </p>
        </NoteCard>
      )}
    </div>
  );
}

function projectRooms(rooms: BoardRoom[], slotIds: Set<number>) {
  return rooms
    .map((room): BoardRoom | null => {
      const bundles = room.bundles
        .map((bundle): BoardBundle | null => {
          const slots = bundle.slots.filter((slot) => slotIds.has(slot.id));
          return slots.length ? { ...bundle, slots } : null;
        })
        .filter((bundle): bundle is BoardBundle => Boolean(bundle));
      return bundles.length ? { ...room, bundles } : null;
    })
    .filter((room): room is BoardRoom => Boolean(room));
}
