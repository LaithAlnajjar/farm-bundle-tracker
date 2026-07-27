import type { FarmRole, FarmSeason } from "@/features/farms/types/farm.types";

export type CatalogCategory =
  | "crops"
  | "forage"
  | "fish"
  | "artisan_goods"
  | "animal_products"
  | "minerals_gems"
  | "monster_loot"
  | "cooking_items"
  | "tree_products"
  | "specialty_items"
  | "currency";

export interface BoardMember {
  membershipId: number;
  userId: number;
  username: string;
  role: FarmRole;
}

export interface BoardSlot {
  id: number;
  slug: string;
  sortOrder: number;
  quantity: number;
  minimumQuality: "standard" | "silver" | "gold" | "iridium";
  item: {
    id: number;
    slug: string;
    name: string;
    category: CatalogCategory;
    availability: { seasons: FarmSeason[]; details: string };
  };
  collection: {
    userId: number;
    username: string;
    collectedAt: string;
  } | null;
  claim: {
    membershipId: number;
    userId: number;
    username: string;
    claimedAt: string;
  } | null;
  needed: boolean;
  claimable: boolean;
}

export interface BundleProgress {
  collected: number;
  credited: number;
  required: number;
  total: number;
  percentage: number;
  complete: boolean;
}

export interface BoardBundle {
  id: number;
  slug: string;
  name: string;
  completionReward: string;
  requiredSlots: number;
  sortOrder: number;
  progress: BundleProgress;
  slots: BoardSlot[];
}

export interface BoardRoom {
  id: number;
  slug: string;
  name: string;
  completionReward: string;
  sortOrder: number;
  progress: {
    completed: number;
    total: number;
    percentage: number;
    complete: boolean;
  };
  bundles: BoardBundle[];
}

export interface FarmBoard {
  farm: {
    id: number;
    name: string;
    currentSeason: FarmSeason;
    membershipRole: FarmRole;
  };
  catalog: { id: number; slug: string; name: string; gameVersion: string };
  canEdit: boolean;
  progress: {
    completed: number;
    total: number;
    percentage: number;
    complete: boolean;
  };
  claimableMembers: BoardMember[];
  rooms: BoardRoom[];
}

export type BoardFilter = "all" | "needed" | "mine" | "season";

export interface BoardPreferences {
  room?: string;
  q: string;
  filter: BoardFilter;
}

export interface BoardItem {
  room: BoardRoom;
  bundle: BoardBundle;
  slot: BoardSlot;
}

export type SlotState = "collected" | "claimed" | "needed" | "optional";

export interface BoardActions {
  collect: (slotId: number, collected: boolean) => void;
  claim: (slotId: number, membershipId: number) => void;
  release: (slotId: number) => void;
  isSlotPending: (slotId: number) => boolean;
}

/** Kept only while old bookmarked URLs are normalized. */
export type LegacyBoardView =
  | "all"
  | "season"
  | "needed"
  | "my-claims"
  | "claims";
