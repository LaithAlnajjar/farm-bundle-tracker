import { beforeEach, describe, expect, it } from "vitest";
import {
  boardPreferenceStorageKey,
  boardPreferencesToParams,
  parseBoardPreferences,
  readStoredBoardPreferences,
} from "./boardPreferences";

describe("board preferences", () => {
  beforeEach(() => window.localStorage.clear());

  it("normalizes legacy claim views", () => {
    expect(
      parseBoardPreferences(
        new URLSearchParams("view=claims&claimant=7&seasonScope=all"),
      ),
    ).toMatchObject({ tab: "tasks", assignee: "7", season: "all" });
    expect(
      parseBoardPreferences(new URLSearchParams("view=season&room=pantry")),
    ).toMatchObject({
      tab: "rooms",
      room: "pantry",
      status: "needed",
      season: "current",
    });
  });

  it("round-trips user and farm scoped preferences", () => {
    const key = boardPreferenceStorageKey(4, 9);
    const preferences = {
      tab: "rooms" as const,
      room: "pantry",
      q: "walleye",
      status: "unclaimed" as const,
      season: "fall" as const,
      assignee: "all" as const,
    };
    window.localStorage.setItem(key, JSON.stringify(preferences));
    expect(readStoredBoardPreferences(key)).toEqual(preferences);
    expect(boardPreferencesToParams(preferences).toString()).toContain(
      "q=walleye",
    );
    expect(key).not.toBe(boardPreferenceStorageKey(5, 9));
  });
});
