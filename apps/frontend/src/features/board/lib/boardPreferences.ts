import type {
  BoardAssigneeFilter,
  BoardPreferences,
  BoardSeasonFilter,
  BoardStatusFilter,
  BoardTab,
  LegacyBoardView,
} from "../types/board.types";

const tabs = new Set<BoardTab>(["overview", "rooms", "tasks"]);
const statuses = new Set<BoardStatusFilter>([
  "all",
  "needed",
  "unclaimed",
  "claimed",
  "collected",
  "optional",
]);
const seasons = new Set<BoardSeasonFilter>([
  "current",
  "all",
  "spring",
  "summer",
  "fall",
  "winter",
]);
const legacyViews = new Set<LegacyBoardView>([
  "all",
  "season",
  "needed",
  "my-claims",
  "claims",
]);
const recognizedKeys = [
  "tab",
  "room",
  "q",
  "status",
  "season",
  "assignee",
  "view",
  "claimant",
  "seasonScope",
];

export const defaultBoardPreferences: BoardPreferences = {
  tab: "overview",
  q: "",
  status: "all",
  season: "current",
  assignee: "me",
};

export function boardPreferenceStorageKey(userId: number, farmId: number) {
  return `bundle-board:preferences:v1:${userId}:${farmId}`;
}

export function hasBoardParameters(params: URLSearchParams) {
  return recognizedKeys.some((key) => params.has(key));
}

const isAssignee = (value: string): value is BoardAssigneeFilter =>
  value === "me" ||
  value === "all" ||
  value === "unassigned" ||
  /^\d+$/.test(value);

export function parseBoardPreferences(params: URLSearchParams): BoardPreferences {
  const legacy = params.get("view");
  if (legacy && legacyViews.has(legacy as LegacyBoardView)) {
    const claimant = params.get("claimant");
    if (legacy === "my-claims") {
      return { ...defaultBoardPreferences, tab: "tasks", assignee: "me" };
    }
    if (legacy === "claims") {
      return {
        ...defaultBoardPreferences,
        tab: "tasks",
        assignee:
          claimant && /^\d+$/.test(claimant)
            ? (claimant as `${number}`)
            : "all",
        season: params.get("seasonScope") === "all" ? "all" : "current",
      };
    }
    return {
      ...defaultBoardPreferences,
      tab: "rooms",
      room: params.get("room") ?? undefined,
      status: legacy === "needed" ? "needed" : legacy === "season" ? "needed" : "all",
      season: legacy === "season" ? "current" : "all",
      assignee: "all",
    };
  }

  const tab = params.get("tab") ?? "";
  const status = params.get("status") ?? "";
  const season = params.get("season") ?? "";
  const assignee = params.get("assignee") ?? "";
  return {
    tab: tabs.has(tab as BoardTab) ? (tab as BoardTab) : "overview",
    room: params.get("room") ?? undefined,
    q: params.get("q") ?? "",
    status: statuses.has(status as BoardStatusFilter)
      ? (status as BoardStatusFilter)
      : "all",
    season: seasons.has(season as BoardSeasonFilter)
      ? (season as BoardSeasonFilter)
      : "current",
    assignee: isAssignee(assignee) ? assignee : "me",
  };
}

export function boardPreferencesToParams(preferences: BoardPreferences) {
  const params = new URLSearchParams();
  if (preferences.tab !== "overview") params.set("tab", preferences.tab);
  if (preferences.room) params.set("room", preferences.room);
  if (preferences.q) params.set("q", preferences.q);
  if (preferences.status !== "all") params.set("status", preferences.status);
  if (preferences.season !== "current") params.set("season", preferences.season);
  if (preferences.assignee !== "me") params.set("assignee", preferences.assignee);
  return params;
}

export function readStoredBoardPreferences(key: string) {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Partial<BoardPreferences>;
    return parseBoardPreferences(boardPreferencesToParams({
      ...defaultBoardPreferences,
      ...parsed,
    }));
  } catch {
    return null;
  }
}
