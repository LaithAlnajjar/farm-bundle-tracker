import { Injectable } from '@nestjs/common';
import { and, asc, eq, exists, isNull } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { InjectDb } from '@/infrastructure/database/drizzle/drizzle.provider';
import type { DBClient } from '@/infrastructure/database/drizzle/db';
import {
  Farm,
  type FarmRole,
  type FarmSeason,
} from '../../domain/entities/farm';
import {
  type CreateFarmData,
  type FarmRepository,
  type UpdateFarmNameData,
} from '../../domain/repositories/farm.repository';
import { farmMemberships, farms } from '../persistence/drizzle/farms.schema';
import { catalogVersions } from '@/modules/catalogs/infrastructure/persistence/drizzle/catalogs.schema';

const currentMembership = alias(farmMemberships, 'current_membership');
const ownerMembership = alias(farmMemberships, 'owner_membership');

const farmSelection = {
  id: farms.id,
  name: farms.name,
  catalogVersionId: farms.catalogVersionId,
  currentSeason: farms.currentSeason,
  ownerUserId: ownerMembership.userId,
  createdAt: farms.createdAt,
  updatedAt: farms.updatedAt,
  deletedAt: farms.deletedAt,
  membershipRole: currentMembership.role,
};

type FarmRow = {
  id: number;
  name: string;
  catalogVersionId: number;
  currentSeason: FarmSeason;
  ownerUserId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  membershipRole: FarmRole;
};

@Injectable()
export class DrizzleFarmRepository implements FarmRepository {
  constructor(@InjectDb() private readonly db: DBClient) {}

  async create(data: CreateFarmData): Promise<Farm> {
    return this.db.transaction(async (tx) => {
      const [catalog] = await tx
        .select({ id: catalogVersions.id })
        .from(catalogVersions)
        .where(isNull(catalogVersions.deactivatedAt));
      if (!catalog) throw new Error('ACTIVE_CATALOG_UNAVAILABLE');
      const [farm] = await tx
        .insert(farms)
        .values({ name: data.name, catalogVersionId: catalog.id })
        .returning();
      if (!farm) throw new Error('Failed to create farm');

      await tx.insert(farmMemberships).values({
        farmId: farm.id,
        userId: data.userId,
        role: 'owner',
      });

      return new Farm(
        farm.id,
        farm.name,
        data.userId,
        farm.catalogVersionId,
        farm.currentSeason,
        farm.createdAt,
        farm.updatedAt,
        farm.deletedAt,
        'owner',
      );
    });
  }

  async findByIdForUser(id: number, userId: number): Promise<Farm | null> {
    const [row] = await this.db
      .select(farmSelection)
      .from(farms)
      .innerJoin(
        currentMembership,
        and(
          eq(currentMembership.farmId, farms.id),
          eq(currentMembership.userId, userId),
        ),
      )
      .innerJoin(
        ownerMembership,
        and(
          eq(ownerMembership.farmId, farms.id),
          eq(ownerMembership.role, 'owner'),
        ),
      )
      .where(and(eq(farms.id, id), isNull(farms.deletedAt)));

    return row ? this.toEntity(row) : null;
  }

  async listByUserId(userId: number): Promise<Farm[]> {
    const rows = await this.db
      .select(farmSelection)
      .from(farms)
      .innerJoin(
        currentMembership,
        and(
          eq(currentMembership.farmId, farms.id),
          eq(currentMembership.userId, userId),
        ),
      )
      .innerJoin(
        ownerMembership,
        and(
          eq(ownerMembership.farmId, farms.id),
          eq(ownerMembership.role, 'owner'),
        ),
      )
      .where(isNull(farms.deletedAt))
      .orderBy(asc(farms.createdAt), asc(farms.id));

    return rows.map((row) => this.toEntity(row));
  }

  async updateName(data: UpdateFarmNameData): Promise<Farm | null> {
    const [updated] = await this.db
      .update(farms)
      .set({ name: data.name, updatedAt: new Date() })
      .where(
        and(
          eq(farms.id, data.id),
          isNull(farms.deletedAt),
          exists(
            this.db
              .select({ id: farmMemberships.id })
              .from(farmMemberships)
              .where(
                and(
                  eq(farmMemberships.farmId, farms.id),
                  eq(farmMemberships.userId, data.userId),
                  eq(farmMemberships.role, 'owner'),
                ),
              ),
          ),
        ),
      )
      .returning();

    if (!updated) return null;
    return new Farm(
      updated.id,
      updated.name,
      data.userId,
      updated.catalogVersionId,
      updated.currentSeason,
      updated.createdAt,
      updated.updatedAt,
      updated.deletedAt,
      'owner',
    );
  }

  async softDelete(id: number, userId: number): Promise<boolean> {
    const [row] = await this.db
      .update(farms)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(
          eq(farms.id, id),
          isNull(farms.deletedAt),
          exists(
            this.db
              .select({ id: farmMemberships.id })
              .from(farmMemberships)
              .where(
                and(
                  eq(farmMemberships.farmId, farms.id),
                  eq(farmMemberships.userId, userId),
                  eq(farmMemberships.role, 'owner'),
                ),
              ),
          ),
        ),
      )
      .returning({ id: farms.id });

    return Boolean(row);
  }

  private toEntity(row: FarmRow): Farm {
    return new Farm(
      row.id,
      row.name,
      row.ownerUserId,
      row.catalogVersionId,
      row.currentSeason,
      row.createdAt,
      row.updatedAt,
      row.deletedAt,
      row.membershipRole,
    );
  }
}
