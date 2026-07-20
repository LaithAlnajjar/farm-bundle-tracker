import { useQuery } from "@tanstack/react-query";
import { listFarmInvites } from "../services";

export const farmInvitesQueryKey = (farmId: number) =>
  ["farms", farmId, "invites"] as const;

export function useFarmInvites(farmId: number, enabled: boolean) {
  return useQuery({
    queryKey: farmInvitesQueryKey(farmId),
    queryFn: () => listFarmInvites(farmId),
    enabled: enabled && Number.isInteger(farmId) && farmId > 0,
  });
}
