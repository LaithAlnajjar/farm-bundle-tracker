import { apiClient } from "@/shared/lib/http/apiClient";
import type { FarmSeason } from "@/features/farms/types/farm.types";
import type { FarmBoard } from "../types/board.types";

const base = (farmId: number) => `/farms/${farmId}/board`;

export const getFarmBoard = (farmId: number): Promise<FarmBoard> =>
  apiClient.get(base(farmId));

export const updateFarmSeason = (
  farmId: number,
  season: FarmSeason,
): Promise<FarmBoard> => apiClient.put(`${base(farmId)}/season`, { season });

export const setSlotCollection = (
  farmId: number,
  slotId: number,
  collected: boolean,
): Promise<FarmBoard> =>
  apiClient.put(`${base(farmId)}/slots/${slotId}/collection`, { collected });

export const setSlotClaim = (
  farmId: number,
  slotId: number,
  claimantMembershipId: number,
): Promise<FarmBoard> =>
  apiClient.put(`${base(farmId)}/slots/${slotId}/claim`, {
    claimantMembershipId,
  });

export const releaseSlotClaim = (
  farmId: number,
  slotId: number,
): Promise<FarmBoard> =>
  apiClient.delete(`${base(farmId)}/slots/${slotId}/claim`);
