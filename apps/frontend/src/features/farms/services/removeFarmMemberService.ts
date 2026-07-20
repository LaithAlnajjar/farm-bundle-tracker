import { apiClient } from "@/shared/lib/http/apiClient";

export const removeFarmMember = (
  farmId: number,
  membershipId: number,
): Promise<void> =>
  apiClient.delete(`/farms/${farmId}/members/${membershipId}`);
