import type { FarmMember, FarmRole } from "../types/farm.types";
import { apiClient } from "@/shared/lib/http/apiClient";

export const addFarmMember = (
  farmId: number,
  identifier: string,
  role: Exclude<FarmRole, "owner">,
): Promise<FarmMember> =>
  apiClient.post(`/farms/${farmId}/members`, { identifier, role });
