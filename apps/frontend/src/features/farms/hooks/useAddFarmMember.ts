import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFarmMember } from "../services";
import { invalidateFarmQueries } from "./invalidateFarmQueries";

export type AddFarmMemberValues = {
  identifier: string;
  role: "editor" | "viewer";
};

export function useAddFarmMember(farmId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: AddFarmMemberValues) =>
      addFarmMember(farmId, values.identifier, values.role),
    onSuccess: () => invalidateFarmQueries(queryClient, farmId),
  });
}
