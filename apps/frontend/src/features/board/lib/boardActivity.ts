import type { FarmBoard } from "../types/board.types";
import { flattenBoard } from "./boardSelectors";

export interface BoardActivityEntry {
  id: string;
  kind: "collected" | "claimed";
  userId: number;
  username: string;
  /** Sentence shown in the rail, e.g. "Sam collected Eel". */
  text: string;
  /** Where it happened, e.g. "Fish Tank · Night Fishing". */
  context: string;
  at: string;
}

/**
 * The board has no event log, so the feed is reconstructed from the timestamps
 * every claim and collection already carries. That keeps it honest: an entry
 * disappears exactly when the thing it describes is undone.
 */
export function getBoardActivity(board: FarmBoard, limit = 6) {
  const entries: BoardActivityEntry[] = [];

  for (const { room, bundle, slot } of flattenBoard(board)) {
    const context = `${room.name} · ${bundle.name}`;
    if (slot.collection) {
      entries.push({
        id: `collected:${slot.id}`,
        kind: "collected",
        userId: slot.collection.userId,
        username: slot.collection.username,
        text: `${slot.collection.username} collected ${slot.item.name}`,
        context,
        at: slot.collection.collectedAt,
      });
    }
    if (slot.claim) {
      entries.push({
        id: `claimed:${slot.id}`,
        kind: "claimed",
        userId: slot.claim.userId,
        username: slot.claim.username,
        text: `${slot.claim.username} claimed ${slot.item.name}`,
        context,
        at: slot.claim.claimedAt,
      });
    }
  }

  return entries
    .sort((a, b) => Date.parse(b.at) - Date.parse(a.at))
    .slice(0, limit);
}
