import { Injectable } from '@nestjs/common';
import { and, asc, eq, inArray, isNull } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { InjectDb } from '@/infrastructure/database/drizzle/drizzle.provider';
import type { DBClient } from '@/infrastructure/database/drizzle/db';
import {
  bundleItemSlots,
  catalogBundles,
  catalogItems,
  catalogRooms,
} from '@/modules/catalogs/infrastructure/persistence/drizzle/catalogs.schema';
import { Farm } from '../../domain/entities/farm';
import type { FarmListItem } from '../../domain/entities/farmListItem';
import {
  deriveFarmListSummary,
  type FarmListSlot,
} from '../../domain/policies/farmList.policy';
import type { FarmListReadRepository } from '../../domain/repositories/farmListRead.repository';
import {
  farmItemClaims,
  farmItemCollections,
  farmMemberships,
  farms,
} from '../persistence/drizzle/farms.schema';

const ownerMembership = alias(farmMemberships, 'list_owner_membership');

@Injectable()
export class DrizzleFarmListReadRepository implements FarmListReadRepository {
  constructor(@InjectDb() private readonly db: DBClient) {}

  async listForUser(userId: number): Promise<FarmListItem[]> {
    const farmRows = await this.db
      .select({
        id: farms.id,
        name: farms.name,
        ownerUserId: ownerMembership.userId,
        catalogVersionId: farms.catalogVersionId,
        currentSeason: farms.currentSeason,
        membershipId: farmMemberships.id,
        membershipRole: farmMemberships.role,
        createdAt: farms.createdAt,
        updatedAt: farms.updatedAt,
      })
      .from(farms)
      .innerJoin(
        farmMemberships,
        and(
          eq(farmMemberships.farmId, farms.id),
          eq(farmMemberships.userId, userId),
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

    if (farmRows.length === 0) return [];

    const slotRows = await this.db
      .select({
        farmId: farms.id,
        bundleId: catalogBundles.id,
        requiredSlots: catalogBundles.requiredSlots,
        currentSeason: farms.currentSeason,
        availability: catalogItems.availability,
        collectionId: farmItemCollections.id,
        claimantMembershipId: farmItemClaims.claimantMembershipId,
      })
      .from(farms)
      .innerJoin(
        catalogRooms,
        eq(catalogRooms.catalogVersionId, farms.catalogVersionId),
      )
      .innerJoin(
        catalogBundles,
        eq(catalogBundles.catalogRoomId, catalogRooms.id),
      )
      .innerJoin(
        bundleItemSlots,
        eq(bundleItemSlots.catalogBundleId, catalogBundles.id),
      )
      .innerJoin(
        catalogItems,
        and(
          eq(catalogItems.id, bundleItemSlots.catalogItemId),
          eq(catalogItems.catalogVersionId, farms.catalogVersionId),
        ),
      )
      .leftJoin(
        farmItemCollections,
        and(
          eq(farmItemCollections.farmId, farms.id),
          eq(farmItemCollections.bundleItemSlotId, bundleItemSlots.id),
        ),
      )
      .leftJoin(
        farmItemClaims,
        and(
          eq(farmItemClaims.farmId, farms.id),
          eq(farmItemClaims.bundleItemSlotId, bundleItemSlots.id),
        ),
      )
      .where(
        inArray(
          farms.id,
          farmRows.map((farm) => farm.id),
        ),
      );

    const membershipByFarm = new Map(
      farmRows.map((farm) => [farm.id, farm.membershipId]),
    );
    const slotsByFarm = new Map<number, FarmListSlot[]>();
    for (const row of slotRows) {
      const slots = slotsByFarm.get(row.farmId) ?? [];
      slots.push({
        bundleId: row.bundleId,
        requiredSlots: row.requiredSlots,
        collected: row.collectionId !== null,
        claimed: row.claimantMembershipId !== null,
        claimedByMe:
          row.claimantMembershipId !== null &&
          row.claimantMembershipId === membershipByFarm.get(row.farmId),
        inSeason: row.availability.seasons.includes(row.currentSeason),
      });
      slotsByFarm.set(row.farmId, slots);
    }

    return farmRows.map((row) => ({
      farm: new Farm(
        row.id,
        row.name,
        row.ownerUserId,
        row.catalogVersionId,
        row.currentSeason,
        row.createdAt,
        row.updatedAt,
        null,
        row.membershipRole,
      ),
      summary: deriveFarmListSummary(slotsByFarm.get(row.id) ?? []),
    }));
  }
}
