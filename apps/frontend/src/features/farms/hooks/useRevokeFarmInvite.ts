import { useMutation, useQueryClient } from "@tanstack/react-query";
import { revokeFarmInvite } from "../services";
import { farmInvitesQueryKey } from "./useFarmInvites";

export function useRevokeFarmInvite(farmId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: number) => revokeFarmInvite(farmId, inviteId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: farmInvitesQueryKey(farmId) }),
  });
}
