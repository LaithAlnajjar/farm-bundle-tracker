import type { FarmMember, FarmRole } from "../types/farm.types";
import { apiClient } from "@/shared/lib/http/apiClient";

export const updateFarmMemberRole = (
  farmId: number,
  membershipId: number,
  role: FarmRole,
): Promise<FarmMember> =>
  apiClient.patch(`/farms/${farmId}/members/${membershipId}`, { role });
