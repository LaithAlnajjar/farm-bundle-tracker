import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFarmMemberRole } from "../services";
import type { FarmRole } from "../types/farm.types";
import { invalidateFarmQueries } from "./invalidateFarmQueries";

export type UpdateFarmMemberRoleValues = {
  membershipId: number;
  role: FarmRole;
};

export function useUpdateFarmMemberRole(farmId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: UpdateFarmMemberRoleValues) =>
      updateFarmMemberRole(farmId, values.membershipId, values.role),
    onSuccess: () => invalidateFarmQueries(queryClient, farmId),
  });
}
