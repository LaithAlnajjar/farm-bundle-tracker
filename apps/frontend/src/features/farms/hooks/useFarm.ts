import { useQuery } from "@tanstack/react-query";
import { getFarm } from "../services";

export const farmQueryKey = (farmId: number) => ["farms", farmId] as const;

export function useFarm(farmId: number) {
  return useQuery({
    queryKey: farmQueryKey(farmId),
    queryFn: () => getFarm(farmId),
    enabled: Number.isInteger(farmId) && farmId > 0,
  });
}
