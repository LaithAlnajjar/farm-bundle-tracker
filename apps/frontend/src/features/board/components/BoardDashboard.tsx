import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { FarmSeason } from "@/features/farms/types/farm.types";
import { getBoardActivity } from "../lib/boardActivity";
import {
  buildRoomLedger,
  getBoardSummary,
  getLeavingSoon,
  getNextReward,
  selectRoom,
} from "../lib/boardSelectors";
import type {
  BoardActions,
  BoardPreferences,
  FarmBoard,
} from "../types/board.types";
import { BoardBundleCard } from "./BoardBundleCard";
import { BoardRail } from "./BoardRail";
import { BoardRoomHeader } from "./BoardRoomHeader";
import { BoardSidebar } from "./BoardSidebar";
import { BoardStatStrip } from "./BoardStatStrip";
import { BoardTopBar } from "./BoardTopBar";

export function BoardDashboard({
  board,
  preferences,
  actions,
  currentUser,
  isFetching,
  seasonPending,
  onPreferencesChange,
  onSeasonChange,
  onRefresh,
  onSignOut,
}: {
  board: FarmBoard;
  preferences: BoardPreferences;
  actions: BoardActions;
  currentUser?: { id: number; username: string };
  isFetching: boolean;
  seasonPending: boolean;
  onPreferencesChange: (patch: Partial<BoardPreferences>) => void;
  onSeasonChange: (season: FarmSeason) => void;
  onRefresh: () => void;
  onSignOut: () => void;
}) {
  const [roomsOpen, setRoomsOpen] = useState(false);

  const currentSeason = board.farm.currentSeason;
  const currentUserId = currentUser?.id;
  const scope = useMemo(
    () => ({ currentSeason, currentUserId }),
    [currentSeason, currentUserId],
  );
  const currentMembership = board.claimableMembers.find(
    (member) => member.userId === currentUserId,
  );

  const room = selectRoom(board, preferences.room);
  const summary = useMemo(
    () => getBoardSummary(board, scope),
    [board, scope],
  );
  const ledger = useMemo(
    () =>
      buildRoomLedger(room, {
        ...scope,
        filter: preferences.filter,
        query: preferences.q,
      }),
    [room, scope, preferences.filter, preferences.q],
  );
  const activity = useMemo(() => getBoardActivity(board), [board]);
  const leavingSoon = useMemo(
    () => getLeavingSoon(board, scope),
    [board, scope],
  );

  const selectRoomSlug = (slug: string) => {
    onPreferencesChange({ room: slug });
    setRoomsOpen(false);
  };

  const sidebar = (
    <BoardSidebar
      activeRoomSlug={room.slug}
      board={board}
      myClaims={summary.myClaims}
      onSelectRoom={selectRoomSlug}
    />
  );

  return (
    <div className="flex min-h-screen bg-background text-ink">
      <aside className="sticky top-0 hidden h-screen w-75 flex-none border-r-3 border-ink-deep lg:block">
        {sidebar}
      </aside>

      {roomsOpen ? (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            aria-label="Close room list"
            className="absolute inset-0 bg-ink/60"
            onClick={() => setRoomsOpen(false)}
            type="button"
          />
          <div className="relative z-10 flex w-75 max-w-[85vw] flex-col border-r-3 border-ink-deep shadow-drop-6">
            <button
              aria-label="Close room list"
              className="absolute top-4 right-3 z-10 grid size-9 place-items-center rounded-md border-2 border-ink bg-parchment text-ink"
              onClick={() => setRoomsOpen(false)}
              type="button"
            >
              <X aria-hidden size={18} />
            </button>
            {sidebar}
          </div>
        </div>
      ) : null}

      <main className="flex min-w-0 flex-1 flex-col">
        <BoardTopBar
          board={board}
          currentUser={currentUser}
          isFetching={isFetching}
          onOpenRooms={() => setRoomsOpen(true)}
          onQueryChange={(q) => onPreferencesChange({ q })}
          onRefresh={onRefresh}
          onSeasonChange={onSeasonChange}
          onSignOut={onSignOut}
          query={preferences.q}
          seasonPending={seasonPending}
        />

        <div className="grid flex-1 items-start gap-4.5 px-4 py-5 pb-11 sm:px-6 xl:grid-cols-[minmax(0,1fr)_20.5rem]">
          <div className="flex min-w-0 flex-col gap-4.5">
            <BoardStatStrip
              currentUser={currentUser}
              season={currentSeason}
              summary={summary}
            />

            <BoardRoomHeader
              filter={preferences.filter}
              onFilterChange={(filter) => onPreferencesChange({ filter })}
              room={room}
            />

            {ledger.length === 0 ? (
              <p className="rounded-md border-3 border-dashed border-sand bg-parchment px-6 py-6.5 text-center font-body text-xl text-ink-soft">
                {preferences.q
                  ? `No slot in ${room.name} matches “${preferences.q}”.`
                  : "Nothing here matches that filter — every slot is handled."}
              </p>
            ) : (
              <div className="flex flex-col gap-3.5">
                {ledger.map((entry) => (
                  <BoardBundleCard
                    actions={actions}
                    canEdit={board.canEdit}
                    currentMembership={currentMembership}
                    currentSeason={currentSeason}
                    entry={entry}
                    key={entry.bundle.id}
                  />
                ))}
              </div>
            )}
          </div>

          <BoardRail
            activity={activity}
            currentUser={currentUser}
            leavingSoon={leavingSoon}
            myClaims={summary.myClaims}
            nextReward={getNextReward(room)}
            onGoToClaim={(item) =>
              onPreferencesChange({ room: item.room.slug, filter: "all", q: "" })
            }
          />
        </div>
      </main>
    </div>
  );
}
