import { apiClient } from "@/shared/lib/http/apiClient";

export const revokeFarmInvite = (
  farmId: number,
  inviteId: number,
): Promise<void> => apiClient.delete(`/farms/${farmId}/invites/${inviteId}`);
