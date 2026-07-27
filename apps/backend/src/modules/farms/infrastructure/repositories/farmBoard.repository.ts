import { Injectable } from '@nestjs/common';
import { and, asc, count, eq, inArray, isNull } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { InjectDb } from '@/infrastructure/database/drizzle/drizzle.provider';
import type { DBClient } from '@/infrastructure/database/drizzle/db';
import { users } from '@/modules/users/infrastructure/persistence/drizzle/users.schema';
import {
  bundleItemSlots,
  catalogBundles,
  catalogItems,
  catalogRooms,
  catalogVersions,
} from '@/modules/catalogs/infrastructure/persistence/drizzle/catalogs.schema';
import type {
  BoardBundleSource,
  BoardRoomSource,
  FarmBoardSource,
} from '../../domain/entities/farmBoard';
import type {
  BoardMutationResult,
  FarmBoardRepository,
} from '../../domain/repositories/farmBoard.repository';
import type { FarmSeason } from '../../domain/entities/farm';
import {
  farmItemClaims,
  farmItemCollections,
  farmMemberships,
  farms,
} from '../persistence/drizzle/farms.schema';

const collector = alias(users, 'board_collector');
const claimantMembership = alias(farmMemberships, 'board_claimant_membership');
const claimant = alias(users, 'board_claimant');

@Injectable()
export class DrizzleFarmBoardRepository implements FarmBoardRepository {
  constructor(@InjectDb() private readonly db: DBClient) {}

  async load(
    farmId: number,
    actorUserId: number,
  ): Promise<FarmBoardSource | null> {
    const [farm] = await this.db
      .select({
        id: farms.id,
        name: farms.name,
        currentSeason: farms.currentSeason,
        membershipRole: farmMemberships.role,
        catalogId: catalogVersions.id,
        catalogSlug: catalogVersions.slug,
        catalogName: catalogVersions.name,
        gameVersion: catalogVersions.gameVersion,
      })
      .from(farms)
      .innerJoin(
        catalogVersions,
        eq(catalogVersions.id, farms.catalogVersionId),
      )
      .innerJoin(
        farmMemberships,
        and(
          eq(farmMemberships.farmId, farms.id),
          eq(farmMemberships.userId, actorUserId),
        ),
      )
      .where(and(eq(farms.id, farmId), isNull(farms.deletedAt)));
    if (!farm) return null;

    const memberRows = await this.db
      .select({
        membershipId: farmMemberships.id,
        userId: farmMemberships.userId,
        username: users.username,
        role: farmMemberships.role,
      })
      .from(farmMemberships)
      .innerJoin(users, eq(users.id, farmMemberships.userId))
      .where(eq(farmMemberships.farmId, farmId))
      .orderBy(asc(farmMemberships.joinedAt), asc(farmMemberships.id));

    const rows = await this.db
      .select({
        roomId: catalogRooms.id,
        roomSlug: catalogRooms.slug,
        roomName: catalogRooms.name,
        roomReward: catalogRooms.completionReward,
        roomSortOrder: catalogRooms.sortOrder,
        bundleId: catalogBundles.id,
        bundleSlug: catalogBundles.slug,
        bundleName: catalogBundles.name,
        bundleReward: catalogBundles.completionReward,
        requiredSlots: catalogBundles.requiredSlots,
        bundleSortOrder: catalogBundles.sortOrder,
        slotId: bundleItemSlots.id,
        slotSlug: bundleItemSlots.slug,
        slotSortOrder: bundleItemSlots.sortOrder,
        quantity: bundleItemSlots.quantity,
        minimumQuality: bundleItemSlots.minimumQuality,
        itemId: catalogItems.id,
        itemSlug: catalogItems.slug,
        itemName: catalogItems.name,
        itemCategory: catalogItems.category,
        availability: catalogItems.availability,
        collectedByUserId: farmItemCollections.collectedByUserId,
        collectorUsername: collector.username,
        collectedAt: farmItemCollections.collectedAt,
        claimantMembershipId: farmItemClaims.claimantMembershipId,
        claimantUserId: claimantMembership.userId,
        claimantUsername: claimant.username,
        claimedAt: farmItemClaims.claimedAt,
      })
      .from(catalogRooms)
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
        eq(catalogItems.id, bundleItemSlots.catalogItemId),
      )
      .leftJoin(
        farmItemCollections,
        and(
          eq(farmItemCollections.farmId, farmId),
          eq(farmItemCollections.bundleItemSlotId, bundleItemSlots.id),
        ),
      )
      .leftJoin(
        collector,
        eq(collector.id, farmItemCollections.collectedByUserId),
      )
      .leftJoin(
        farmItemClaims,
        and(
          eq(farmItemClaims.farmId, farmId),
          eq(farmItemClaims.bundleItemSlotId, bundleItemSlots.id),
        ),
      )
      .leftJoin(
        claimantMembership,
        eq(claimantMembership.id, farmItemClaims.claimantMembershipId),
      )
      .leftJoin(claimant, eq(claimant.id, claimantMembership.userId))
      .where(
        and(
          eq(catalogRooms.catalogVersionId, farm.catalogId),
          eq(catalogItems.catalogVersionId, farm.catalogId),
        ),
      )
      .orderBy(
        asc(catalogRooms.sortOrder),
        asc(catalogBundles.sortOrder),
        asc(bundleItemSlots.sortOrder),
      );

    const rooms = new Map<number, BoardRoomSource>();
    const bundles = new Map<number, BoardBundleSource>();
    for (const row of rows) {
      let room = rooms.get(row.roomId);
      if (!room) {
        room = {
          id: row.roomId,
          slug: row.roomSlug,
          name: row.roomName,
          completionReward: row.roomReward,
          sortOrder: row.roomSortOrder,
          bundles: [],
        };
        rooms.set(room.id, room);
      }
      let bundle = bundles.get(row.bundleId);
      if (!bundle) {
        bundle = {
          id: row.bundleId,
          slug: row.bundleSlug,
          name: row.bundleName,
          completionReward: row.bundleReward,
          requiredSlots: row.requiredSlots,
          sortOrder: row.bundleSortOrder,
          slots: [],
        };
        bundles.set(bundle.id, bundle);
        room.bundles.push(bundle);
      }
      bundle.slots.push({
        id: row.slotId,
        slug: row.slotSlug,
        sortOrder: row.slotSortOrder,
        quantity: row.quantity,
        minimumQuality: row.minimumQuality,
        item: {
          id: row.itemId,
          slug: row.itemSlug,
          name: row.itemName,
          category: row.itemCategory,
          availability: row.availability,
        },
        collection:
          row.collectedByUserId && row.collectorUsername && row.collectedAt
            ? {
                userId: row.collectedByUserId,
                username: row.collectorUsername,
                collectedAt: row.collectedAt,
              }
            : null,
        claim:
          row.claimantMembershipId &&
          row.claimantUserId &&
          row.claimantUsername &&
          row.claimedAt
            ? {
                membershipId: row.claimantMembershipId,
                userId: row.claimantUserId,
                username: row.claimantUsername,
                claimedAt: row.claimedAt,
              }
            : null,
      });
    }

    return {
      farm: {
        id: farm.id,
        name: farm.name,
        currentSeason: farm.currentSeason,
        membershipRole: farm.membershipRole,
      },
      catalog: {
        id: farm.catalogId,
        slug: farm.catalogSlug,
        name: farm.catalogName,
        gameVersion: farm.gameVersion,
      },
      members: memberRows,
      rooms: [...rooms.values()],
    };
  }

  async updateSeason(farmId: number, season: FarmSeason): Promise<boolean> {
    const [updated] = await this.db
      .update(farms)
      .set({ currentSeason: season, updatedAt: new Date() })
      .where(and(eq(farms.id, farmId), isNull(farms.deletedAt)))
      .returning({ id: farms.id });
    return Boolean(updated);
  }

  async setCollection(input: {
    farmId: number;
    slotId: number;
    actorUserId: number;
    collected: boolean;
  }): Promise<BoardMutationResult> {
    return this.db.transaction(async (tx) => {
      const [farm] = await tx
        .select({ catalogVersionId: farms.catalogVersionId })
        .from(farms)
        .where(and(eq(farms.id, input.farmId), isNull(farms.deletedAt)))
        .for('update');
      if (!farm) return 'not-found';
      const [slot] = await tx
        .select({
          id: bundleItemSlots.id,
          bundleId: catalogBundles.id,
          requiredSlots: catalogBundles.requiredSlots,
        })
        .from(bundleItemSlots)
        .innerJoin(
          catalogBundles,
          eq(catalogBundles.id, bundleItemSlots.catalogBundleId),
        )
        .innerJoin(
          catalogRooms,
          eq(catalogRooms.id, catalogBundles.catalogRoomId),
        )
        .where(
          and(
            eq(bundleItemSlots.id, input.slotId),
            eq(catalogRooms.catalogVersionId, farm.catalogVersionId),
          ),
        );
      if (!slot) return 'not-found';

      if (!input.collected) {
        await tx
          .delete(farmItemCollections)
          .where(
            and(
              eq(farmItemCollections.farmId, input.farmId),
              eq(farmItemCollections.bundleItemSlotId, input.slotId),
            ),
          );
        return 'ok';
      }

      await tx
        .insert(farmItemCollections)
        .values({
          farmId: input.farmId,
          bundleItemSlotId: input.slotId,
          collectedByUserId: input.actorUserId,
        })
        .onConflictDoNothing({
          target: [
            farmItemCollections.farmId,
            farmItemCollections.bundleItemSlotId,
          ],
        });
      await tx
        .delete(farmItemClaims)
        .where(
          and(
            eq(farmItemClaims.farmId, input.farmId),
            eq(farmItemClaims.bundleItemSlotId, input.slotId),
          ),
        );

      const bundleSlots = await tx
        .select({ id: bundleItemSlots.id })
        .from(bundleItemSlots)
        .where(eq(bundleItemSlots.catalogBundleId, slot.bundleId));
      const slotIds = bundleSlots.map((item) => item.id);
      const [collectionCount] = await tx
        .select({ value: count() })
        .from(farmItemCollections)
        .where(
          and(
            eq(farmItemCollections.farmId, input.farmId),
            inArray(farmItemCollections.bundleItemSlotId, slotIds),
          ),
        );
      if (Number(collectionCount?.value ?? 0) >= slot.requiredSlots) {
        await tx
          .delete(farmItemClaims)
          .where(
            and(
              eq(farmItemClaims.farmId, input.farmId),
              inArray(farmItemClaims.bundleItemSlotId, slotIds),
            ),
          );
      }
      return 'ok';
    });
  }

  async setClaim(input: {
    farmId: number;
    slotId: number;
    claimantMembershipId: number;
  }): Promise<BoardMutationResult> {
    return this.db.transaction(async (tx) => {
      const [farm] = await tx
        .select({ catalogVersionId: farms.catalogVersionId })
        .from(farms)
        .where(and(eq(farms.id, input.farmId), isNull(farms.deletedAt)))
        .for('update');
      if (!farm) return 'not-found';
      const [target] = await tx
        .select({ role: farmMemberships.role })
        .from(farmMemberships)
        .where(
          and(
            eq(farmMemberships.id, input.claimantMembershipId),
            eq(farmMemberships.farmId, input.farmId),
          ),
        );
      if (!target) return 'not-found';
      if (target.role === 'viewer') return 'claimant-ineligible';

      const [slot] = await tx
        .select({
          bundleId: catalogBundles.id,
          requiredSlots: catalogBundles.requiredSlots,
        })
        .from(bundleItemSlots)
        .innerJoin(
          catalogBundles,
          eq(catalogBundles.id, bundleItemSlots.catalogBundleId),
        )
        .innerJoin(
          catalogRooms,
          eq(catalogRooms.id, catalogBundles.catalogRoomId),
        )
        .where(
          and(
            eq(bundleItemSlots.id, input.slotId),
            eq(catalogRooms.catalogVersionId, farm.catalogVersionId),
          ),
        );
      if (!slot) return 'not-found';
      const bundleSlots = await tx
        .select({ id: bundleItemSlots.id })
        .from(bundleItemSlots)
        .where(eq(bundleItemSlots.catalogBundleId, slot.bundleId));
      const slotIds = bundleSlots.map((item) => item.id);
      const collections = await tx
        .select({ slotId: farmItemCollections.bundleItemSlotId })
        .from(farmItemCollections)
        .where(
          and(
            eq(farmItemCollections.farmId, input.farmId),
            inArray(farmItemCollections.bundleItemSlotId, slotIds),
          ),
        );
      if (
        collections.some((item) => item.slotId === input.slotId) ||
        collections.length >= slot.requiredSlots
      ) {
        return 'not-claimable';
      }
      const [existing] = await tx
        .select({ claimantMembershipId: farmItemClaims.claimantMembershipId })
        .from(farmItemClaims)
        .where(
          and(
            eq(farmItemClaims.farmId, input.farmId),
            eq(farmItemClaims.bundleItemSlotId, input.slotId),
          ),
        );
      if (existing?.claimantMembershipId === input.claimantMembershipId)
        return 'ok';
      await tx
        .insert(farmItemClaims)
        .values({
          farmId: input.farmId,
          bundleItemSlotId: input.slotId,
          claimantMembershipId: input.claimantMembershipId,
        })
        .onConflictDoUpdate({
          target: [farmItemClaims.farmId, farmItemClaims.bundleItemSlotId],
          set: {
            claimantMembershipId: input.claimantMembershipId,
            claimedAt: new Date(),
          },
        });
      return 'ok';
    });
  }

  async releaseClaim(
    farmId: number,
    slotId: number,
  ): Promise<BoardMutationResult> {
    return this.db.transaction(async (tx) => {
      const [farm] = await tx
        .select({ catalogVersionId: farms.catalogVersionId })
        .from(farms)
        .where(and(eq(farms.id, farmId), isNull(farms.deletedAt)))
        .for('update');
      if (!farm) return 'not-found';
      const [slot] = await tx
        .select({ id: bundleItemSlots.id })
        .from(bundleItemSlots)
        .innerJoin(
          catalogBundles,
          eq(catalogBundles.id, bundleItemSlots.catalogBundleId),
        )
        .innerJoin(
          catalogRooms,
          eq(catalogRooms.id, catalogBundles.catalogRoomId),
        )
        .where(
          and(
            eq(bundleItemSlots.id, slotId),
            eq(catalogRooms.catalogVersionId, farm.catalogVersionId),
          ),
        );
      if (!slot) return 'not-found';
      await tx
        .delete(farmItemClaims)
        .where(
          and(
            eq(farmItemClaims.farmId, farmId),
            eq(farmItemClaims.bundleItemSlotId, slotId),
          ),
        );
      return 'ok';
    });
  }
}
