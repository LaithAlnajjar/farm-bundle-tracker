import type { Farm } from "../types/farm.types";
import { apiClient } from "@/shared/lib/http/apiClient";

export const redeemFarmInvite = (token: string): Promise<Farm> =>
  apiClient.post(`/farm-invites/${encodeURIComponent(token)}/redeem`);
