import { useQuery } from "@tanstack/react-query";
import { listFarmMembers } from "../services";

export const farmMembersQueryKey = (farmId: number) =>
  ["farms", farmId, "members"] as const;

export function useFarmMembers(farmId: number) {
  return useQuery({
    queryKey: farmMembersQueryKey(farmId),
    queryFn: () => listFarmMembers(farmId),
    enabled: Number.isInteger(farmId) && farmId > 0,
  });
}
