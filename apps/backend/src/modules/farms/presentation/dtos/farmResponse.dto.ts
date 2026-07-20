import type { FarmRole } from '../../domain/entities/farm';

export type FarmResponseDto = {
  id: number;
  name: string;
  userId: number;
  membershipRole: FarmRole;
  createdAt: string;
  updatedAt: string;
};
