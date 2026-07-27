import { LogOut, Menu, RefreshCw, Search } from "lucide-react";
import type { FarmSeason } from "@/features/farms/types/farm.types";
import {
  PixelIcon,
  seasonSurface,
  UserBadge,
} from "@/shared/components/farm-ui";
import { cn } from "@/shared/lib/utils";
import type { FarmBoard } from "../types/board.types";

const seasons: FarmSeason[] = ["spring", "summer", "fall", "winter"];

const seasonIcon = {
  spring: "sprout",
  summer: "jar",
  fall: "pumpkin",
  winter: "gem",
} as const;

/** Chunky pill shared by every control in the bar. */
const pill =
  "inline-flex items-center gap-2 rounded-md border-3 border-bark bg-paper shadow-drop-2";

export function BoardTopBar({
  board,
  query,
  isFetching,
  seasonPending,
  currentUser,
  onQueryChange,
  onSeasonChange,
  onRefresh,
  onOpenRooms,
  onSignOut,
}: {
  board: FarmBoard;
  query: string;
  isFetching: boolean;
  seasonPending: boolean;
  currentUser?: { id: number; username: string };
  onQueryChange: (value: string) => void;
  onSeasonChange: (season: FarmSeason) => void;
  onRefresh: () => void;
  onOpenRooms: () => void;
  onSignOut: () => void;
}) {
  const season = board.farm.currentSeason;

  return (
    <div className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b-3 border-bark bg-parchment px-4 py-2.5 sm:px-6">
      <button
        aria-label="Browse rooms"
        className={cn(pill, "size-11 justify-center lg:hidden")}
        onClick={onOpenRooms}
        type="button"
      >
        <Menu aria-hidden size={20} />
      </button>

      {/* Too narrow to share a row with the pills — wraps below them instead. */}
      <label
        className={cn(
          pill,
          "order-last w-full min-w-0 px-2.5 py-1",
          "sm:order-none sm:w-82.5 sm:flex-none",
        )}
      >
        <Search aria-hidden className="flex-none text-soil" size={17} />
        <span className="sr-only">Search the board</span>
        <input
          className="min-w-0 flex-1 border-0 bg-transparent font-body text-[19px] text-ink placeholder:text-soil/70 focus:outline-none"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search any item across the board…"
          type="search"
          value={query}
        />
      </label>

      <label
        className={cn(
          "relative inline-flex items-center gap-1.5 rounded-md border-3 px-2.5 py-1 font-body text-[18px] shadow-drop-2",
          seasonSurface[season],
          !board.canEdit && "pointer-events-none",
          seasonPending && "opacity-60",
        )}
      >
        <PixelIcon className="flex-none" name={seasonIcon[season]} size={18} />
        <span className="sr-only">Shared season</span>
        <span aria-hidden className="capitalize">
          {season}
        </span>
        {board.canEdit ? (
          <select
            aria-label="Shared season"
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={seasonPending}
            onChange={(event) =>
              onSeasonChange(event.target.value as FarmSeason)
            }
            value={season}
          >
            {seasons.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : null}
      </label>

      <div className="ml-auto flex items-center gap-3">
        <button
          className={cn(pill, "px-2.75 py-1 font-body text-[18px] text-ink")}
          onClick={onRefresh}
          type="button"
        >
          <RefreshCw
            aria-hidden
            className={cn("text-soil", isFetching && "animate-spin")}
            size={16}
          />
          <span className="hidden sm:inline">Live</span>
          <span
            aria-hidden
            className={cn(
              "size-2.25 rounded-[1px] border-2 border-ink",
              isFetching ? "bg-harvest" : "animate-ping-dot bg-leaf-bright",
            )}
          />
          <span className="sr-only" role="status">
            {isFetching ? "Checking the board for updates" : "Board is up to date"}
          </span>
        </button>

        {currentUser ? (
          <span className={cn(pill, "py-0.75 pr-2.75 pl-0.75")}>
            <UserBadge
              size="sm"
              userId={currentUser.id}
              username={currentUser.username}
            />
            <span className="hidden max-w-32 truncate font-body text-[18px] text-ink sm:inline">
              {currentUser.username}
            </span>
            <span className="hidden font-micro text-[9px] tracking-[1px] text-soil uppercase md:inline">
              {board.farm.membershipRole}
            </span>
          </span>
        ) : null}

        <button
          aria-label="Sign out"
          className={cn(pill, "size-11 justify-center text-soil hover:text-berry")}
          onClick={onSignOut}
          type="button"
        >
          <LogOut aria-hidden size={18} />
        </button>
      </div>
    </div>
  );
}
