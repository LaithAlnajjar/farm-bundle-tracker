import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFarm } from "../services";
import { farmsQueryKey } from "./useFarms";

export function useCreateFarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFarm,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: farmsQueryKey }),
  });
}
