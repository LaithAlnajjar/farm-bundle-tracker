import type { BoardItem, FarmBoard } from "../types/board.types";
import { flattenBoard } from "./boardSelectors";

export type BoardChangeNotice = {
  title: string;
  description?: string;
  level: "farm" | "room" | "bundle" | "item" | "claim";
};

export function boardFingerprint(board: FarmBoard) {
  return JSON.stringify({
    season: board.farm.currentSeason,
    progress: board.progress.completed,
    slots: flattenBoard(board).map(({ slot }) => [
      slot.id,
      slot.collection?.userId ?? 0,
      slot.claim?.membershipId ?? 0,
    ]),
  });
}

export function describeBoardChange(
  previous: FarmBoard,
  next: FarmBoard,
): BoardChangeNotice | null {
  if (!previous.progress.complete && next.progress.complete) {
    return {
      title: "Community Center complete!",
      description: "Every bundle on the farm is finished.",
      level: "farm",
    };
  }

  for (const room of next.rooms) {
    const before = previous.rooms.find((item) => item.id === room.id);
    if (before && !before.progress.complete && room.progress.complete) {
      return {
        title: `${room.name} complete!`,
        description: `Reward: ${room.completionReward}`,
        level: "room",
      };
    }
  }

  for (const room of next.rooms) {
    const previousRoom = previous.rooms.find((item) => item.id === room.id);
    for (const bundle of room.bundles) {
      const before = previousRoom?.bundles.find((item) => item.id === bundle.id);
      if (before && !before.progress.complete && bundle.progress.complete) {
        return {
          title: `${bundle.name} complete!`,
          description: `Reward: ${bundle.completionReward}`,
          level: "bundle",
        };
      }
    }
  }

  const beforeItems = new Map(
    flattenBoard(previous).map((item) => [item.slot.id, item]),
  );
  const changedCollections: BoardItem[] = [];
  const changedClaims: BoardItem[] = [];
  for (const item of flattenBoard(next)) {
    const before = beforeItems.get(item.slot.id);
    if (!before) continue;
    if (
      before.slot.collection?.userId !== item.slot.collection?.userId ||
      Boolean(before.slot.collection) !== Boolean(item.slot.collection)
    ) {
      changedCollections.push(item);
    } else if (
      before.slot.claim?.membershipId !== item.slot.claim?.membershipId
    ) {
      changedClaims.push(item);
    }
  }
  if (changedCollections.length > 1 || changedClaims.length > 1) {
    return {
      title: "Board updated",
      description: `${changedCollections.length + changedClaims.length} items changed by your farm team.`,
      level: "item",
    };
  }
  const collected = changedCollections[0];
  if (collected?.slot.collection) {
    return {
      title: `${collected.slot.collection.username} collected ${collected.slot.item.name}`,
      description: `${collected.room.name} · ${collected.bundle.name}`,
      level: "item",
    };
  }
  if (collected) {
    return {
      title: `${collected.slot.item.name} reopened`,
      description: `${collected.room.name} · ${collected.bundle.name}`,
      level: "item",
    };
  }
  const claimed = changedClaims[0];
  if (claimed?.slot.claim) {
    return {
      title: `${claimed.slot.claim.username} claimed ${claimed.slot.item.name}`,
      description: `${claimed.room.name} · ${claimed.bundle.name}`,
      level: "claim",
    };
  }
  if (claimed) {
    return {
      title: `${claimed.slot.item.name} is unclaimed`,
      description: `${claimed.room.name} · ${claimed.bundle.name}`,
      level: "claim",
    };
  }
  return null;
}
