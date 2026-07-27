import type { FarmSeason } from "@/features/farms/types/farm.types";
import type {
  BoardAssigneeFilter,
  BoardItem,
  BoardMember,
  BoardPreferences,
  BoardSeasonFilter,
  BoardStatusFilter,
  FarmBoard,
} from "../types/board.types";

export function flattenBoard(board: FarmBoard): BoardItem[] {
  return board.rooms.flatMap((room) =>
    room.bundles.flatMap((bundle) =>
      bundle.slots.map((slot) => ({ room, bundle, slot })),
    ),
  );
}

export function matchesStatus(item: BoardItem, status: BoardStatusFilter) {
  const { slot } = item;
  if (status === "needed") return slot.needed;
  if (status === "unclaimed") return slot.needed && !slot.claim;
  if (status === "claimed") return slot.needed && Boolean(slot.claim);
  if (status === "collected") return Boolean(slot.collection);
  if (status === "optional") return !slot.needed && !slot.collection;
  return true;
}

export function matchesSeason(
  item: BoardItem,
  season: BoardSeasonFilter,
  currentSeason: FarmSeason,
) {
  if (season === "all") return true;
  const selected = season === "current" ? currentSeason : season;
  return item.slot.item.availability.seasons.includes(selected);
}

export function matchesAssignee(
  item: BoardItem,
  assignee: BoardAssigneeFilter,
  currentUserId?: number,
) {
  if (assignee === "all") return true;
  if (assignee === "unassigned") return !item.slot.claim;
  if (assignee === "me") return item.slot.claim?.userId === currentUserId;
  return item.slot.claim?.membershipId === Number(assignee);
}

export function filterBoardItems(input: {
  items: BoardItem[];
  preferences: BoardPreferences;
  currentSeason: FarmSeason;
  currentUserId?: number;
  requireClaim?: boolean;
}) {
  const query = input.preferences.q.trim().toLocaleLowerCase();
  return input.items.filter((item) => {
    if (input.requireClaim && !item.slot.claim) return false;
    if (!matchesStatus(item, input.preferences.status)) return false;
    if (
      !matchesSeason(
        item,
        input.preferences.season,
        input.currentSeason,
      )
    ) {
      return false;
    }
    if (
      !matchesAssignee(
        item,
        input.preferences.assignee,
        input.currentUserId,
      )
    ) {
      return false;
    }
    if (!query) return true;
    return [item.slot.item.name, item.bundle.name, item.room.name].some((value) =>
      value.toLocaleLowerCase().includes(query),
    );
  });
}

export function getOverviewData(board: FarmBoard, currentUserId?: number) {
  const items = flattenBoard(board);
  const myClaims = items.filter(
    (item) => item.slot.claim?.userId === currentUserId,
  );
  const myCurrentSeasonClaims = myClaims.filter((item) =>
    item.slot.item.availability.seasons.includes(board.farm.currentSeason),
  );
  const myLaterClaims = myClaims.filter(
    (item) => !myCurrentSeasonClaims.includes(item),
  );
  const availableNow = items.filter(
    (item) =>
      item.slot.needed &&
      !item.slot.claim &&
      item.slot.item.availability.seasons.includes(board.farm.currentSeason),
  );
  return {
    myCurrentSeasonClaims,
    myLaterClaims,
    availableNow,
    availablePreview: availableNow.slice(0, 6),
  };
}

export function getMemberClaimCounts(board: FarmBoard) {
  const counts = new Map<number, number>();
  for (const item of flattenBoard(board)) {
    if (item.slot.claim) {
      counts.set(
        item.slot.claim.membershipId,
        (counts.get(item.slot.claim.membershipId) ?? 0) + 1,
      );
    }
  }
  return board.claimableMembers.map((member: BoardMember) => ({
    member,
    count: counts.get(member.membershipId) ?? 0,
  }));
}
