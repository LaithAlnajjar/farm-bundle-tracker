import type { FarmListItem } from '../entities/farmListItem';

export interface FarmListReadRepository {
  listForUser(userId: number): Promise<FarmListItem[]>;
}
