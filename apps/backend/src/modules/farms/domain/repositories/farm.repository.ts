import { Farm } from '../entities/farm';

export type CreateFarmData = {
  name: string;
  userId: number;
};

export type UpdateFarmNameData = {
  id: number;
  userId: number;
  name: string;
};

export interface FarmRepository {
  create(farm: CreateFarmData): Promise<Farm>;
  findByIdForUser(id: number, userId: number): Promise<Farm | null>;
  listByUserId(userId: number): Promise<Farm[]>;
  updateName(farm: UpdateFarmNameData): Promise<Farm | null>;
  softDelete(id: number, userId: number): Promise<boolean>;
}
