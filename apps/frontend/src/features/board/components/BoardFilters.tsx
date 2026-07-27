import { Search, SlidersHorizontal, X } from "lucide-react";
import type {
  BoardMember,
  BoardPreferences,
  BoardSeasonFilter,
  BoardStatusFilter,
} from "../types/board.types";

const statuses: Array<{ value: BoardStatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "needed", label: "Needed" },
  { value: "unclaimed", label: "Unclaimed" },
  { value: "claimed", label: "Claimed" },
  { value: "collected", label: "Collected" },
  { value: "optional", label: "Optional" },
];

export function BoardFilters({
  preferences,
  members,
  resultCount,
  taskMode = false,
  onChange,
  onClear,
}: {
  preferences: BoardPreferences;
  members: BoardMember[];
  resultCount: number;
  taskMode?: boolean;
  onChange: (
    patch: Partial<BoardPreferences>,
    options?: { replace?: boolean },
  ) => void;
  onClear: () => void;
}) {
  const filtered =
    preferences.q ||
    preferences.status !== "all" ||
    preferences.season !== "current" ||
    (taskMode && preferences.assignee !== "me");
  return (
    <div className="rounded-xl border-2 border-sand-strong bg-paper p-3 shadow-drop-2 sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search items, bundles, and rooms</span>
          <Search
            aria-hidden
            className="absolute top-1/2 left-3 -translate-y-1/2 text-soil"
            size={18}
          />
          <input
            className="min-h-11 w-full rounded-lg border-2 border-bark bg-parchment pr-3 pl-10 font-ui text-sm text-ink outline-none placeholder:text-oat-ink focus:border-harvest focus:ring-3 focus:ring-harvest/20"
            onChange={(event) =>
              onChange({ q: event.target.value }, { replace: true })
            }
            placeholder="Search item, bundle, or room…"
            type="search"
            value={preferences.q}
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          {!taskMode ? (
            <label className="inline-flex shrink-0 items-center gap-2 font-ui text-xs font-bold text-soil">
              <SlidersHorizontal aria-hidden size={16} />
              <span className="sr-only">Status</span>
              <select
                className="min-h-11 rounded-lg border-2 border-bark bg-paper px-2 text-sm text-ink"
                onChange={(event) =>
                  onChange({ status: event.target.value as BoardStatusFilter })
                }
                value={preferences.status}
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="shrink-0 font-ui text-xs font-bold text-soil">
              <span className="sr-only">Assignee</span>
              <select
                className="min-h-11 rounded-lg border-2 border-bark bg-paper px-2 text-sm text-ink"
                onChange={(event) => onChange({ assignee: event.target.value as BoardPreferences["assignee"] })}
                value={preferences.assignee}
              >
                <option value="me">My tasks</option>
                <option value="all">Everyone</option>
                {members.map((member) => (
                  <option key={member.membershipId} value={member.membershipId}>
                    {member.username}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="shrink-0 font-ui text-xs font-bold text-soil">
            <span className="sr-only">Season</span>
            <select
              className="min-h-11 rounded-lg border-2 border-bark bg-paper px-2 text-sm text-ink capitalize"
              onChange={(event) =>
                onChange({ season: event.target.value as BoardSeasonFilter })
              }
              value={preferences.season}
            >
              <option value="current">Current season</option>
              <option value="all">All seasons</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
            </select>
          </label>
        </div>
      </div>
      <div className="mt-2 flex min-h-8 items-center justify-between gap-3 font-ui text-xs text-ink-soft">
        <span>{resultCount} matching items</span>
        {filtered ? (
          <button
            className="inline-flex min-h-9 items-center gap-1 font-display font-bold text-berry underline decoration-2 underline-offset-3"
            onClick={onClear}
            type="button"
          >
            <X aria-hidden size={15} /> Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}
