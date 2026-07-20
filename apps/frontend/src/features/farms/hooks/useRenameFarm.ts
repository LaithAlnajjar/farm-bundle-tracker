import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameFarm } from "../services";
import { invalidateFarmQueries } from "./invalidateFarmQueries";

export function useRenameFarm(farmId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => renameFarm(farmId, name),
    onSuccess: () => invalidateFarmQueries(queryClient, farmId),
  });
}
