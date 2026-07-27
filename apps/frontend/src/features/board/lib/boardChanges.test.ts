import { describe, expect, it } from "vitest";
import { dashboardFixture } from "../fixtures/board.fixture";
import { boardFingerprint, describeBoardChange } from "./boardChanges";

describe("board change feedback", () => {
  it("reports the highest newly completed level", () => {
    const before = structuredClone(dashboardFixture);
    const after = structuredClone(dashboardFixture);
    const completed = after.rooms[0]!.bundles[1]!;
    before.rooms[0]!.bundles[1]!.progress.complete = false;
    before.rooms[0]!.bundles[1]!.progress.credited = 2;
    expect(describeBoardChange(before, after)).toEqual({
      title: `${completed.name} complete!`,
      description: `Reward: ${completed.completionReward}`,
      level: "bundle",
    });
  });

  it("describes a teammate collection and fingerprints state", () => {
    const before = structuredClone(dashboardFixture);
    const after = structuredClone(dashboardFixture);
    before.rooms[0]!.bundles[0]!.slots[2]!.collection = null;
    expect(describeBoardChange(before, after)?.title).toContain(
      "laith collected Cauliflower",
    );
    expect(boardFingerprint(before)).not.toBe(boardFingerprint(after));
  });
});
