import { RefreshCw } from "lucide-react";
import type { FarmSeason } from "@/features/farms/types/farm.types";
import { CircularProgress, StatusBadge } from "@/shared/components/farm-ui";
import type { FarmBoard } from "../types/board.types";
import { cn } from "@/shared/lib/utils";

const seasons: FarmSeason[] = ["spring", "summer", "fall", "winter"];

export function BoardHero({
  board,
  dataUpdatedAt,
  isFetching,
  seasonPending,
  onSeasonChange,
  onRefresh,
}: {
  board: FarmBoard;
  dataUpdatedAt: number;
  isFetching: boolean;
  seasonPending: boolean;
  onSeasonChange: (season: FarmSeason) => void;
  onRefresh: () => void;
}) {
  const remaining = board.progress.total - board.progress.completed;
  return (
    <section className="overflow-hidden rounded-2xl border-3 border-bark bg-soil text-paper shadow-drop-6">
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex items-center gap-4">
          <CircularProgress
            className="border-paper/70"
            max={board.progress.total}
            value={board.progress.completed}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-micro text-[9px] tracking-[0.13em] text-gold uppercase">
                Community Center
              </p>
              <StatusBadge className="sm:hidden" tone="neutral">
                {board.farm.membershipRole}
              </StatusBadge>
            </div>
            <h1 className="mt-1 truncate font-display text-4xl leading-none font-bold sm:text-5xl">
              {board.farm.name}
            </h1>
            <p className="mt-2 font-ui text-sm text-linen">
              {board.progress.completed}/{board.progress.total} bundles complete
              <span className="mx-1.5">·</span>
              {remaining === 0 ? "Center complete" : `${remaining} to go`}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 font-micro text-[9px] tracking-[0.12em] text-linen uppercase">
            Shared season
          </p>
          <div className="grid grid-cols-4 gap-1 rounded-xl border-2 border-bark bg-bark/55 p-1">
            {seasons.map((season) => (
              <button
                aria-pressed={board.farm.currentSeason === season}
                className={cn(
                  "min-h-11 rounded-lg px-2 font-display text-sm font-bold capitalize focus-visible:ring-3 focus-visible:ring-gold",
                  board.farm.currentSeason === season
                    ? "bg-paper text-ink shadow-drop-2"
                    : "text-linen hover:bg-soil",
                )}
                disabled={!board.canEdit || seasonPending}
                key={season}
                onClick={() => onSeasonChange(season)}
                type="button"
              >
                {season}
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-end gap-2 font-ui text-xs text-linen">
            <span aria-live="polite">
              {isFetching
                ? "Checking for updates…"
                : dataUpdatedAt
                  ? `Updated ${new Date(dataUpdatedAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}`
                  : "Up to date"}
            </span>
            <button
              aria-label="Refresh board"
              className="grid size-11 place-items-center rounded-md hover:bg-bark/50 focus-visible:ring-3 focus-visible:ring-gold"
              disabled={isFetching}
              onClick={onRefresh}
              type="button"
            >
              <RefreshCw
                aria-hidden
                className={isFetching ? "animate-spin" : undefined}
                size={17}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
