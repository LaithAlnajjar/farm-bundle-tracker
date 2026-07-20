import type { CreatedFarmInvite } from "../types/farm.types";
import { apiClient } from "@/shared/lib/http/apiClient";

export const createFarmInvite = (farmId: number): Promise<CreatedFarmInvite> =>
  apiClient.post(`/farms/${farmId}/invites`);
