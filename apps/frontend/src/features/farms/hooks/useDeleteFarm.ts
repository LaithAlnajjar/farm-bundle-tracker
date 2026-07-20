import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFarm } from "../services";
import { farmsQueryKey } from "./useFarms";

export function useDeleteFarm(farmId: number, onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteFarm(farmId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: farmsQueryKey });
      onSuccess();
    },
  });
}
