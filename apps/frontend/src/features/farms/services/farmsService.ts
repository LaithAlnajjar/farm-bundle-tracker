import type { Farm } from '@/features/farms/types/farm.types';
import { apiClient } from '@/shared/lib/http/apiClient';

export function listFarms(): Promise<Farm[]> {
  return apiClient.get<Farm[]>('/farms');
}
