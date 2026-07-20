import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leaveFarm } from "../services";
import { farmsQueryKey } from "./useFarms";

export function useLeaveFarm(farmId: number, onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => leaveFarm(farmId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: farmsQueryKey });
      onSuccess();
    },
  });
}
