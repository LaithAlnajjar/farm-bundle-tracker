import type { Farm } from "../types/farm.types";
import { apiClient } from "@/shared/lib/http/apiClient";

export const listFarms = (): Promise<Farm[]> => apiClient.get("/farms");
