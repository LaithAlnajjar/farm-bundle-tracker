import type {
  BoardFilter,
  BoardPreferences,
  LegacyBoardView,
} from "../types/board.types";

const filters = new Set<BoardFilter>(["all", "needed", "mine", "season"]);
const legacyViews = new Set<LegacyBoardView>([
  "all",
  "season",
  "needed",
  "my-claims",
  "claims",
]);

/** Every param the board owns, including the ones only legacy URLs still use. */
const recognizedKeys = [
  "room",
  "q",
  "filter",
  "tab",
  "view",
  "status",
  "season",
  "assignee",
  "claimant",
  "seasonScope",
];

export const defaultBoardPreferences: BoardPreferences = {
  q: "",
  filter: "all",
};

export function boardPreferenceStorageKey(userId: number, farmId: number) {
  return `bundle-board:preferences:v2:${userId}:${farmId}`;
}

export function hasBoardParameters(params: URLSearchParams) {
  return recognizedKeys.some((key) => params.has(key));
}

/**
 * Collapses the retired tab/status/season/assignee URLs onto the single chip
 * that now carries the same intent, so old bookmarks still land somewhere
 * recognizable.
 */
function parseLegacyFilter(params: URLSearchParams): BoardFilter | null {
  const view = params.get("view");
  if (view && legacyViews.has(view as LegacyBoardView)) {
    if (view === "my-claims" || view === "claims") return "mine";
    if (view === "season") return "season";
    if (view === "needed") return "needed";
    return "all";
  }
  if (params.get("tab") === "tasks" || params.get("assignee") === "me") {
    return "mine";
  }
  if (params.get("season") === "current") return "season";
  const status = params.get("status");
  if (status === "needed" || status === "unclaimed") return "needed";
  return params.has("tab") || params.has("status") ? "all" : null;
}

export function parseBoardPreferences(
  params: URLSearchParams,
): BoardPreferences {
  const filter = params.get("filter") ?? "";
  return {
    room: params.get("room") ?? undefined,
    q: params.get("q") ?? "",
    filter: filters.has(filter as BoardFilter)
      ? (filter as BoardFilter)
      : (parseLegacyFilter(params) ?? defaultBoardPreferences.filter),
  };
}

export function boardPreferencesToParams(preferences: BoardPreferences) {
  const params = new URLSearchParams();
  if (preferences.room) params.set("room", preferences.room);
  if (preferences.q) params.set("q", preferences.q);
  if (preferences.filter !== "all") params.set("filter", preferences.filter);
  return params;
}

export function readStoredBoardPreferences(key: string) {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Partial<BoardPreferences>;
    return parseBoardPreferences(
      boardPreferencesToParams({ ...defaultBoardPreferences, ...parsed }),
    );
  } catch {
    return null;
  }
}
