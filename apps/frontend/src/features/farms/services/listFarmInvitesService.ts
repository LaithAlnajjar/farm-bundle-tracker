import type { FarmInvite } from "../types/farm.types";
import { apiClient } from "@/shared/lib/http/apiClient";

export const listFarmInvites = (farmId: number): Promise<FarmInvite[]> =>
  apiClient.get(`/farms/${farmId}/invites`);
