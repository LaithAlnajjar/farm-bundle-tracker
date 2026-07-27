import type { FarmListItem } from "../types/farm.types";
import { apiClient } from "@/shared/lib/http/apiClient";

export const listFarms = (): Promise<FarmListItem[]> => apiClient.get("/farms");
