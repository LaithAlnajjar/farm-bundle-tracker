import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFarm } from "../services";
import { farmsQueryKey } from "./useFarms";

export function useCreateFarm(
  onCreated?: (farm: Awaited<ReturnType<typeof createFarm>>) => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFarm,
    onSuccess: async (farm) => {
      await queryClient.invalidateQueries({ queryKey: farmsQueryKey });
      onCreated?.(farm);
    },
  });
}
