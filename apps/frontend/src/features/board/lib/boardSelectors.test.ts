import { describe, expect, it } from "vitest";
import type { BoardItem, BoardSlot } from "../types/board.types";
import { matchesAssignee, matchesSeason, matchesStatus } from "./boardSelectors";

const makeSlot = (overrides: Partial<BoardSlot> = {}): BoardSlot => ({
  id: 1,
  slug: "parsnip",
  sortOrder: 1,
  quantity: 1,
  minimumQuality: "standard",
  item: {
    id: 1,
    slug: "parsnip",
    name: "Parsnip",
    category: "crops",
    availability: { seasons: ["spring"], details: "Spring crop" },
  },
  collection: null,
  claim: null,
  needed: true,
  claimable: true,
  ...overrides,
});

const makeItem = (slot = makeSlot()): BoardItem => ({
  slot,
  bundle: {
    id: 1,
    slug: "spring-crops",
    name: "Spring Crops",
    completionReward: "Speed-Gro",
    requiredSlots: 4,
    sortOrder: 1,
    progress: {
      collected: 0,
      credited: 0,
      required: 4,
      total: 4,
      percentage: 0,
      complete: false,
    },
    slots: [slot],
  },
  room: {
    id: 1,
    slug: "pantry",
    name: "Pantry",
    completionReward: "Greenhouse",
    sortOrder: 1,
    progress: { completed: 0, total: 6, percentage: 0, complete: false },
    bundles: [],
  },
});

describe("board selectors", () => {
  it("separates needed, unclaimed, collected, and optional states", () => {
    expect(matchesStatus(makeItem(), "needed")).toBe(true);
    expect(matchesStatus(makeItem(), "unclaimed")).toBe(true);
    expect(
      matchesStatus(
        makeItem(makeSlot({ needed: false, claimable: false })),
        "optional",
      ),
    ).toBe(true);
    expect(
      matchesStatus(
        makeItem(
          makeSlot({
            collection: {
              userId: 1,
              username: "farmer",
              collectedAt: "2026-07-22T00:00:00.000Z",
            },
          }),
        ),
        "collected",
      ),
    ).toBe(true);
  });

  it("filters seasons and assignees", () => {
    const claimed = makeItem(
      makeSlot({
        claim: {
          membershipId: 7,
          userId: 4,
          username: "Leah",
          claimedAt: "2026-07-22T00:00:00.000Z",
        },
      }),
    );
    expect(matchesSeason(claimed, "current", "spring")).toBe(true);
    expect(matchesSeason(claimed, "current", "winter")).toBe(false);
    expect(matchesAssignee(claimed, "me", 4)).toBe(true);
    expect(matchesAssignee(claimed, "8", 4)).toBe(false);
  });
});
