import type { FarmRole } from '../../domain/entities/farm';
import type { FarmSeason } from '../../domain/entities/farm';

export type FarmResponseDto = {
  id: number;
  name: string;
  userId: number;
  catalogVersionId: number;
  currentSeason: FarmSeason;
  membershipRole: FarmRole;
  createdAt: string;
  updatedAt: string;
};

export type FarmListItemResponseDto = FarmResponseDto & {
  summary: {
    progress: {
      completed: number;
      total: number;
      percentage: number;
      complete: boolean;
    };
    currentSeasonNeededItems: number;
    currentSeasonUnclaimedItems: number;
    myActiveClaims: number;
  };
};
