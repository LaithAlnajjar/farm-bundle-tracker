import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFarmInvite } from "../services";
import type { CreatedFarmInvite } from "../types/farm.types";
import { farmInvitesQueryKey } from "./useFarmInvites";

export function useCreateFarmInvite(
  farmId: number,
  onSuccess: (invite: CreatedFarmInvite) => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createFarmInvite(farmId),
    onSuccess: async (invite) => {
      await queryClient.invalidateQueries({
        queryKey: farmInvitesQueryKey(farmId),
      });
      onSuccess(invite);
    },
  });
}
