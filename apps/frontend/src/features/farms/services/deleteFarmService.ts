import { apiClient } from "@/shared/lib/http/apiClient";

export const deleteFarm = (farmId: number): Promise<void> =>
  apiClient.delete(`/farms/${farmId}`);
