import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeFarmMember } from "../services";
import { invalidateFarmQueries } from "./invalidateFarmQueries";

export function useRemoveFarmMember(farmId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (membershipId: number) =>
      removeFarmMember(farmId, membershipId),
    onSuccess: () => invalidateFarmQueries(queryClient, farmId),
  });
}
