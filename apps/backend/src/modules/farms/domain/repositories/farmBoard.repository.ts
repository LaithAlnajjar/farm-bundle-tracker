import type { FarmBoardSource } from '../entities/farmBoard';
import type { FarmSeason } from '../entities/farm';

export type BoardMutationResult =
  | 'ok'
  | 'not-found'
  | 'not-claimable'
  | 'claimant-ineligible';

export interface FarmBoardRepository {
  load(farmId: number, actorUserId: number): Promise<FarmBoardSource | null>;
  updateSeason(farmId: number, season: FarmSeason): Promise<boolean>;
  setCollection(input: {
    farmId: number;
    slotId: number;
    actorUserId: number;
    collected: boolean;
  }): Promise<BoardMutationResult>;
  setClaim(input: {
    farmId: number;
    slotId: number;
    claimantMembershipId: number;
  }): Promise<BoardMutationResult>;
  releaseClaim(farmId: number, slotId: number): Promise<BoardMutationResult>;
}
