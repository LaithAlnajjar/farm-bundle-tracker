import type { Farm } from "../types/farm.types";
import { apiClient } from "@/shared/lib/http/apiClient";

export const getFarm = (farmId: number): Promise<Farm> =>
  apiClient.get(`/farms/${farmId}`);
