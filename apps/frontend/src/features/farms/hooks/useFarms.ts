import { useQuery } from '@tanstack/react-query';
import { listFarms } from '@/features/farms/services/farmsService';

export const farmsQueryKey = ['farms'] as const;

export function useFarms() {
  return useQuery({
    queryKey: farmsQueryKey,
    queryFn: listFarms,
  });
}
