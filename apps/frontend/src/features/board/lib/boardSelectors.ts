import type { FarmSeason } from "@/features/farms/types/farm.types";
import type {
  BoardBundle,
  BoardFilter,
  BoardItem,
  BoardRoom,
  BoardSlot,
  FarmBoard,
  SlotState,
} from "../types/board.types";

export interface BoardScope {
  currentSeason: FarmSeason;
  currentUserId?: number;
}

export function flattenBoard(board: FarmBoard): BoardItem[] {
  return board.rooms.flatMap((room) =>
    room.bundles.flatMap((bundle) =>
      bundle.slots.map((slot) => ({ room, bundle, slot })),
    ),
  );
}

export function slotState(slot: BoardSlot): SlotState {
  if (slot.collection) return "collected";
  if (slot.claim) return "claimed";
  return slot.needed ? "needed" : "optional";
}

export function isInSeason(slot: BoardSlot, season: FarmSeason) {
  return slot.item.availability.seasons.includes(season);
}

/** True for items that are gone once the shared season rolls over. */
export function isSeasonal(slot: BoardSlot) {
  return slot.item.availability.seasons.length < 4;
}

const seasonOrder: FarmSeason[] = ["spring", "summer", "fall", "winter"];

/**
 * Bundles carry no season of their own, so the label comes from the union of
 * what their slots are available in — the window the bundle is workable in.
 */
export function bundleSeasons(bundle: BoardBundle): FarmSeason[] {
  const seasons = new Set(
    bundle.slots.flatMap((slot) => slot.item.availability.seasons),
  );
  return seasonOrder.filter((season) => seasons.has(season));
}

function matchesFilter(
  slot: BoardSlot,
  filter: BoardFilter,
  scope: BoardScope,
) {
  if (filter === "needed") return !slot.collection && slot.needed;
  if (filter === "mine") return slot.claim?.userId === scope.currentUserId;
  if (filter === "season") {
    return (
      !slot.collection && slot.needed && isInSeason(slot, scope.currentSeason)
    );
  }
  return true;
}

function matchesQuery(item: BoardItem, query: string) {
  if (!query) return true;
  return [item.slot.item.name, item.bundle.name, item.room.name].some((value) =>
    value.toLocaleLowerCase().includes(query),
  );
}

export interface LedgerBundle {
  bundle: BoardBundle;
  slots: BoardSlot[];
  /** Slots this bundle owns that the active filter or search hid. */
  hiddenCount: number;
}

/**
 * The ledger keeps a bundle's identity intact while narrowing its rows, and
 * drops the bundle entirely once nothing inside it survives the filter.
 */
export function buildRoomLedger(
  room: BoardRoom,
  input: BoardScope & { filter: BoardFilter; query: string },
): LedgerBundle[] {
  const query = input.query.trim().toLocaleLowerCase();
  const ledger: LedgerBundle[] = [];

  for (const bundle of room.bundles) {
    const slots = bundle.slots.filter(
      (slot) =>
        matchesFilter(slot, input.filter, input) &&
        matchesQuery({ room, bundle, slot }, query),
    );
    if (slots.length > 0) {
      ledger.push({
        bundle,
        slots,
        hiddenCount: bundle.slots.length - slots.length,
      });
    }
  }

  return ledger;
}

/** Resolves the room in view, preferring the first one still unfinished. */
export function selectRoom(board: FarmBoard, slug?: string): BoardRoom {
  const requested = slug
    ? board.rooms.find((room) => room.slug === slug)
    : undefined;
  const unfinished = board.rooms.find((room) => !room.progress.complete);
  return requested ?? unfinished ?? board.rooms[0]!;
}

export function getMyClaims(board: FarmBoard, currentUserId?: number) {
  if (!currentUserId) return [];
  return flattenBoard(board).filter(
    (item) => item.slot.claim?.userId === currentUserId,
  );
}

export interface BoardSummary {
  bundlesStamped: number;
  bundlesTotal: number;
  neededCount: number;
  inSeasonCount: number;
  myClaims: BoardItem[];
}

export function getBoardSummary(
  board: FarmBoard,
  scope: BoardScope,
): BoardSummary {
  const outstanding = flattenBoard(board).filter(
    (item) => item.slot.needed && !item.slot.collection,
  );

  return {
    bundlesStamped: board.progress.completed,
    bundlesTotal: board.progress.total,
    neededCount: outstanding.length,
    inSeasonCount: outstanding.filter((item) =>
      isInSeason(item.slot, scope.currentSeason),
    ).length,
    myClaims: getMyClaims(board, scope.currentUserId),
  };
}

export interface NextReward {
  bundle: BoardBundle;
  slotsLeft: number;
}

/** The reward the room in view is closest to unlocking. */
export function getNextReward(room: BoardRoom): NextReward | null {
  const candidates = room.bundles
    .filter((bundle) => !bundle.progress.complete)
    .map((bundle) => ({
      bundle,
      slotsLeft: Math.max(
        bundle.progress.required - bundle.progress.credited,
        0,
      ),
    }));
  if (candidates.length === 0) return null;
  return candidates.reduce((closest, candidate) =>
    candidate.slotsLeft < closest.slotsLeft ? candidate : closest,
  );
}

/**
 * Seasonal items that are still outstanding and available right now — the ones
 * that become unobtainable when the season turns.
 */
export function getLeavingSoon(board: FarmBoard, scope: BoardScope, limit = 4) {
  return flattenBoard(board)
    .filter(
      (item) =>
        item.slot.needed &&
        !item.slot.collection &&
        isSeasonal(item.slot) &&
        isInSeason(item.slot, scope.currentSeason),
    )
    .sort(
      (a, b) =>
        a.slot.item.availability.seasons.length -
        b.slot.item.availability.seasons.length,
    )
    .slice(0, limit);
}
