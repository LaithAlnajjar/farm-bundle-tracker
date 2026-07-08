import { InjectDb } from '@/infrastructure/database/drizzle/drizzle.provider';
import type { DBClient } from '@/infrastructure/database/drizzle/db';
import {
  type CreateFarmData,
  FarmRepository,
  type UpdateFarmNameData,
} from '../../domain/repositories/farm.repository';
import { farms } from '../persistence/drizzle/farms.schema';
import { Injectable } from '@nestjs/common';
import { and, asc, eq, isNull } from 'drizzle-orm';
import { Farm } from '../../domain/entities/farm';

@Injectable()
export class DrizzleFarmRepository implements FarmRepository {
  constructor(@InjectDb() private readonly db: DBClient) {}

  async create(farm: CreateFarmData): Promise<Farm> {
    const [row] = await this.db
      .insert(farms)
      .values({
        name: farm.name,
        userId: farm.userId,
      })
      .returning();

    if (!row) {
      throw new Error('Failed to create farm');
    }

    return this.toEntity(row);
  }

  async findByIdForUser(id: number, userId: number): Promise<Farm | null> {
    const [farm] = await this.db
      .select()
      .from(farms)
      .where(
        and(
          eq(farms.id, id),
          eq(farms.userId, userId),
          isNull(farms.deletedAt),
        ),
      );

    return farm ? this.toEntity(farm) : null;
  }

  async listByUserId(userId: number): Promise<Farm[]> {
    const userFarms = await this.db
      .select()
      .from(farms)
      .where(and(eq(farms.userId, userId), isNull(farms.deletedAt)))
      .orderBy(asc(farms.createdAt), asc(farms.id));

    return userFarms.map((farm) => this.toEntity(farm));
  }

  async updateName(farm: UpdateFarmNameData): Promise<Farm | null> {
    const [updateFarm] = await this.db
      .update(farms)
      .set({
        name: farm.name,
        updatedAt: new Date(),
      })
      .where(and(eq(farms.id, farm.id)))
      .returning();

    return updateFarm ? this.toEntity(updateFarm) : null;
  }

  async softDelete(id: number): Promise<boolean> {
    const [row] = await this.db
      .update(farms)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(farms.id, id)))
      .returning({ id: farms.id });

    return Boolean(row);
  }

  private toEntity(farm: typeof farms.$inferSelect): Farm {
    return new Farm(
      farm.id,
      farm.name,
      farm.userId,
      farm.createdAt,
      farm.updatedAt,
      farm.deletedAt,
    );
  }
}
