import { Injectable } from '@nestjs/common';
import { and, asc, eq, isNull } from 'drizzle-orm';
import { InjectDb } from '@/infrastructure/database/drizzle/drizzle.provider';
import type { DBClient } from '@/infrastructure/database/drizzle/db';
import type { Catalog, CatalogBundle, CatalogRoom } from '../../domain/catalog';
import type { CatalogRepository } from '../../domain/catalog.repository';
import {
  bundleItemSlots,
  catalogBundles,
  catalogItems,
  catalogRooms,
  catalogVersions,
} from '../persistence/drizzle/catalogs.schema';

@Injectable()
export class DrizzleCatalogRepository implements CatalogRepository {
  constructor(@InjectDb() private readonly db: DBClient) {}

  async getActive(): Promise<Catalog | null> {
    const [version] = await this.db
      .select()
      .from(catalogVersions)
      .where(isNull(catalogVersions.deactivatedAt));
    if (!version) return null;

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
      .where(
        and(
          eq(catalogRooms.catalogVersionId, version.id),
          eq(catalogItems.catalogVersionId, version.id),
        ),
      )
      .orderBy(
        asc(catalogRooms.sortOrder),
        asc(catalogBundles.sortOrder),
        asc(bundleItemSlots.sortOrder),
      );

    const rooms = new Map<number, CatalogRoom>();
    const bundles = new Map<number, CatalogBundle>();
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
      });
    }

    return {
      id: version.id,
      slug: version.slug,
      name: version.name,
      gameVersion: version.gameVersion,
      manifestRevision: version.manifestRevision,
      rooms: [...rooms.values()],
    };
  }
}
