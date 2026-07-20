import type { FarmRole } from '../../domain/entities/farm';

export type FarmMemberResponseDto = {
  id: number;
  userId: number;
  username: string;
  email: string;
  role: FarmRole;
  joinedAt: string;
};
