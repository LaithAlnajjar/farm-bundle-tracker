import { useQuery } from "@tanstack/react-query";
import { getFarmBoard } from "../services/boardService";

export const farmBoardQueryKey = (farmId: number) =>
  ["farms", farmId, "board"] as const;

export function useFarmBoard(farmId: number) {
  return useQuery({
    queryKey: farmBoardQueryKey(farmId),
    queryFn: () => getFarmBoard(farmId),
    enabled: Number.isInteger(farmId) && farmId > 0,
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}
