import { useMutation, useQueryClient } from "@tanstack/react-query";
import { redeemFarmInvite } from "../services";
import type { Farm } from "../types/farm.types";
import { farmsQueryKey } from "./useFarms";

export function useRedeemFarmInvite(
  token: string,
  onSuccess: (farm: Farm) => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => redeemFarmInvite(token),
    onSuccess: async (farm) => {
      await queryClient.invalidateQueries({ queryKey: farmsQueryKey });
      onSuccess(farm);
    },
  });
}
