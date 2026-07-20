import type { FarmMember } from "../types/farm.types";
import { apiClient } from "@/shared/lib/http/apiClient";

export const listFarmMembers = (farmId: number): Promise<FarmMember[]> =>
  apiClient.get(`/farms/${farmId}/members`);
