import type { QueryClient } from "@tanstack/react-query";
import { farmQueryKey } from "./useFarm";
import { farmInvitesQueryKey } from "./useFarmInvites";
import { farmMembersQueryKey } from "./useFarmMembers";
import { farmsQueryKey } from "./useFarms";

export function invalidateFarmQueries(
  queryClient: QueryClient,
  farmId: number,
) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: farmsQueryKey }),
    queryClient.invalidateQueries({ queryKey: farmQueryKey(farmId) }),
    queryClient.invalidateQueries({ queryKey: farmMembersQueryKey(farmId) }),
    queryClient.invalidateQueries({ queryKey: farmInvitesQueryKey(farmId) }),
  ]);
}
