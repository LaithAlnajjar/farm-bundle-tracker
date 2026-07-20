import type { Farm } from "../types/farm.types";
import { apiClient } from "@/shared/lib/http/apiClient";

export const renameFarm = (farmId: number, name: string): Promise<Farm> =>
  apiClient.patch(`/farms/${farmId}`, { name });
