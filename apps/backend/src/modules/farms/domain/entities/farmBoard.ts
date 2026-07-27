import type {
  Catalog,
  CatalogBundle,
  CatalogRoom,
  CatalogSlot,
} from '@/modules/catalogs/domain/catalog';
import type { FarmRole, FarmSeason } from './farm';

export type BoardProgress = {
  completed: number;
  total: number;
  percentage: number;
  complete: boolean;
};

export type BundleProgress = {
  collected: number;
  credited: number;
  required: number;
  total: number;
  percentage: number;
  complete: boolean;
};

export type BoardMember = {
  membershipId: number;
  userId: number;
  username: string;
  role: FarmRole;
};

export type BoardSlotSource = CatalogSlot & {
  collection: {
    userId: number;
    username: string;
    collectedAt: Date;
  } | null;
  claim: {
    membershipId: number;
    userId: number;
    username: string;
    claimedAt: Date;
  } | null;
};

export type BoardBundleSource = Omit<CatalogBundle, 'slots'> & {
  slots: BoardSlotSource[];
};

export type BoardRoomSource = Omit<CatalogRoom, 'bundles'> & {
  bundles: BoardBundleSource[];
};

export type FarmBoardSource = {
  farm: {
    id: number;
    name: string;
    currentSeason: FarmSeason;
    membershipRole: FarmRole;
  };
  catalog: Pick<Catalog, 'id' | 'slug' | 'name' | 'gameVersion'>;
  members: BoardMember[];
  rooms: BoardRoomSource[];
};

export type BoardSlot = BoardSlotSource & {
  needed: boolean;
  claimable: boolean;
};

export type BoardBundle = Omit<BoardBundleSource, 'slots'> & {
  progress: BundleProgress;
  slots: BoardSlot[];
};

export type BoardRoom = Omit<BoardRoomSource, 'bundles'> & {
  progress: BoardProgress;
  bundles: BoardBundle[];
};

export type FarmBoard = Omit<FarmBoardSource, 'members' | 'rooms'> & {
  canEdit: boolean;
  progress: BoardProgress;
  claimableMembers: BoardMember[];
  rooms: BoardRoom[];
};
