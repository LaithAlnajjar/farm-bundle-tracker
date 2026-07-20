import { apiClient } from "@/shared/lib/http/apiClient";

export const leaveFarm = (farmId: number): Promise<void> =>
  apiClient.delete(`/farms/${farmId}/members/me`);
