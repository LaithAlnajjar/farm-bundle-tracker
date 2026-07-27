import type { Farm } from './farm';
import type { BoardProgress } from './farmBoard';

export type FarmListSummary = {
  progress: BoardProgress;
  currentSeasonNeededItems: number;
  currentSeasonUnclaimedItems: number;
  myActiveClaims: number;
};

export type FarmListItem = {
  farm: Farm;
  summary: FarmListSummary;
};
