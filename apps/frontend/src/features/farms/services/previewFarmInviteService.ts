import type { FarmInvitePreview } from "../types/farm.types";
import { apiClient } from "@/shared/lib/http/apiClient";

export const previewFarmInvite = (token: string): Promise<FarmInvitePreview> =>
  apiClient.get(`/farm-invites/${encodeURIComponent(token)}`, { auth: false });
