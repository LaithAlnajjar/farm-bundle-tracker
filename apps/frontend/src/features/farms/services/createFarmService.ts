import type { Farm } from "../types/farm.types";
import { apiClient } from "@/shared/lib/http/apiClient";

export const createFarm = (name: string): Promise<Farm> =>
  apiClient.post("/farms", { name });
