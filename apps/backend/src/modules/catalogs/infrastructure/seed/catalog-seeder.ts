import { eq, inArray, sql } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  bundleItemSlots,
  catalogBundles,
  catalogItems,
  catalogRooms,
  catalogVersions,
} from '../persistence/drizzle/catalogs.schema';
import { loadCatalogManifest } from './catalog-manifest';

type SeedResult = {
  status: 'already-current' | 'seeded';
  versionId: number;
  rooms: number;
  bundles: number;
  items: number;
  slots: number;
  checksum: string;
};

const failDrift = (details: string[]): never => {
  throw new Error(
    `Structural catalog drift detected. No data was changed. ` +
      `Create an explicit migration or a new catalog version for structural changes:\n- ${details.join('\n- ')}`,
  );
};

const compareKeySets = (
  label: string,
  expected: Set<string>,
  actual: Set<string>,
  errors: string[],
) => {
  const missing = [...expected].filter((key) => !actual.has(key));
  const unexpected = [...actual].filter((key) => !expected.has(key));
  if (missing.length > 0)
    errors.push(`${label} missing canonical keys: ${missing.join(', ')}`);
  if (unexpected.length > 0)
    errors.push(`${label} contains unexpected keys: ${unexpected.join(', ')}`);
};

const availabilityMatches = (
  left: { seasons: string[]; details: string },
  right: { seasons: readonly string[]; details: string },
) =>
  left.details === right.details &&
  left.seasons.length === right.seasons.length &&
  left.seasons.every((season, index) => season === right.seasons[index]);

export const seedCatalog = async (db: NodePgDatabase): Promise<SeedResult> => {
  const { manifest, checksum } = loadCatalogManifest();

  return db.transaction(async (tx) => {
    const existingVersion = (
      await tx
        .select()
        .from(catalogVersions)
        .where(eq(catalogVersions.slug, manifest.slug))
    )[0];

    if (
      existingVersion &&
      existingVersion.gameVersion !== manifest.gameVersion
    ) {
      failDrift([
        `catalog ${manifest.slug} is stored for game ${existingVersion.gameVersion}, not ${manifest.gameVersion}`,
      ]);
    }

    const readStoredCatalog = async (versionId: number) => {
      const rooms = await tx
        .select()
        .from(catalogRooms)
        .where(eq(catalogRooms.catalogVersionId, versionId));
      const roomIds = rooms.map((room) => room.id);
      const bundles =
        roomIds.length === 0
          ? []
          : await tx
              .select()
              .from(catalogBundles)
              .where(inArray(catalogBundles.catalogRoomId, roomIds));
      const items = await tx
        .select()
        .from(catalogItems)
        .where(eq(catalogItems.catalogVersionId, versionId));
      const bundleIds = bundles.map((bundle) => bundle.id);
      const slots =
        bundleIds.length === 0
          ? []
          : await tx
              .select()
              .from(bundleItemSlots)
              .where(inArray(bundleItemSlots.catalogBundleId, bundleIds));
      return { rooms, bundles, items, slots };
    };

    const inspectStored = (
      stored: Awaited<ReturnType<typeof readStoredCatalog>>,
      mode: 'structural' | 'complete',
    ) => {
      const errors: string[] = [];
      const expectedBundles = manifest.rooms.flatMap((room) =>
        room.bundles.map((bundle) => ({ room, bundle })),
      );
      const expectedSlots = expectedBundles.flatMap(({ room, bundle }) =>
        bundle.slots.map((slot) => ({ room, bundle, slot })),
      );
      const roomsById = new Map(stored.rooms.map((room) => [room.id, room]));
      const bundlesById = new Map(
        stored.bundles.map((bundle) => [bundle.id, bundle]),
      );
      const itemsById = new Map(stored.items.map((item) => [item.id, item]));

      compareKeySets(
        'rooms',
        new Set(manifest.rooms.map((room) => room.slug)),
        new Set(stored.rooms.map((room) => room.slug)),
        errors,
      );
      compareKeySets(
        'bundles',
        new Set(
          expectedBundles.map(
            ({ room, bundle }) => `${room.slug}/${bundle.slug}`,
          ),
        ),
        new Set(
          stored.bundles.map((bundle) => {
            const room = roomsById.get(bundle.catalogRoomId);
            return `${room?.slug ?? `orphan-room-${bundle.catalogRoomId}`}/${bundle.slug}`;
          }),
        ),
        errors,
      );
      compareKeySets(
        'items',
        new Set(Object.keys(manifest.items)),
        new Set(stored.items.map((item) => item.slug)),
        errors,
      );
      compareKeySets(
        'slots',
        new Set(
          expectedSlots.map(
            ({ room, bundle, slot }) =>
              `${room.slug}/${bundle.slug}/${slot.slug}`,
          ),
        ),
        new Set(
          stored.slots.map((slot) => {
            const bundle = bundlesById.get(slot.catalogBundleId);
            const room = bundle
              ? roomsById.get(bundle.catalogRoomId)
              : undefined;
            return `${room?.slug ?? 'orphan-room'}/${bundle?.slug ?? `orphan-bundle-${slot.catalogBundleId}`}/${slot.slug}`;
          }),
        ),
        errors,
      );

      for (const { room, bundle } of expectedBundles) {
        const storedRoom = stored.rooms.find(
          (candidate) => candidate.slug === room.slug,
        );
        const storedBundle = stored.bundles.find(
          (candidate) =>
            candidate.slug === bundle.slug &&
            candidate.catalogRoomId === storedRoom?.id,
        );
        if (
          storedBundle &&
          storedBundle.requiredSlots !== bundle.requiredSlots
        ) {
          errors.push(
            `${room.slug}/${bundle.slug} required-slots changed from ${storedBundle.requiredSlots} to ${bundle.requiredSlots}`,
          );
        }
      }

      for (const { room, bundle, slot } of expectedSlots) {
        const storedRoom = stored.rooms.find(
          (candidate) => candidate.slug === room.slug,
        );
        const storedBundle = stored.bundles.find(
          (candidate) =>
            candidate.slug === bundle.slug &&
            candidate.catalogRoomId === storedRoom?.id,
        );
        const storedSlot = stored.slots.find(
          (candidate) =>
            candidate.slug === slot.slug &&
            candidate.catalogBundleId === storedBundle?.id,
        );
        if (!storedSlot) continue;
        const storedItem = itemsById.get(storedSlot.catalogItemId);
        if (storedItem?.slug !== slot.itemSlug) {
          errors.push(
            `${room.slug}/${bundle.slug}/${slot.slug} item changed from ${storedItem?.slug ?? 'orphan'} to ${slot.itemSlug}`,
          );
        }
        if (storedSlot.quantity !== slot.quantity) {
          errors.push(
            `${room.slug}/${bundle.slug}/${slot.slug} quantity changed from ${storedSlot.quantity} to ${slot.quantity}`,
          );
        }
        if (storedSlot.minimumQuality !== slot.minimumQuality) {
          errors.push(
            `${room.slug}/${bundle.slug}/${slot.slug} minimum quality changed from ${storedSlot.minimumQuality} to ${slot.minimumQuality}`,
          );
        }
      }

      if (mode === 'complete') {
        for (const room of manifest.rooms) {
          const storedRoom = stored.rooms.find(
            (candidate) => candidate.slug === room.slug,
          );
          if (
            !storedRoom ||
            storedRoom.name !== room.name ||
            storedRoom.completionReward !== room.completionReward ||
            storedRoom.sortOrder !== room.sortOrder
          ) {
            errors.push(
              `room ${room.slug} descriptive fields do not match the manifest`,
            );
          }
          for (const bundle of room.bundles) {
            const storedBundle = stored.bundles.find(
              (candidate) =>
                candidate.slug === bundle.slug &&
                candidate.catalogRoomId === storedRoom?.id,
            );
            if (
              !storedBundle ||
              storedBundle.name !== bundle.name ||
              storedBundle.completionReward !== bundle.completionReward ||
              storedBundle.sortOrder !== bundle.sortOrder
            ) {
              errors.push(
                `bundle ${room.slug}/${bundle.slug} descriptive fields do not match the manifest`,
              );
            }
            for (const slot of bundle.slots) {
              const storedSlot = stored.slots.find(
                (candidate) =>
                  candidate.slug === slot.slug &&
                  candidate.catalogBundleId === storedBundle?.id,
              );
              if (!storedSlot || storedSlot.sortOrder !== slot.sortOrder) {
                errors.push(
                  `slot ${room.slug}/${bundle.slug}/${slot.slug} display order does not match the manifest`,
                );
              }
            }
          }
        }
        for (const item of Object.values(manifest.items)) {
          const storedItem = stored.items.find(
            (candidate) => candidate.slug === item.slug,
          );
          if (
            !storedItem ||
            storedItem.name !== item.name ||
            storedItem.category !== item.category ||
            !availabilityMatches(storedItem.availability, item.availability)
          ) {
            errors.push(
              `item ${item.slug} descriptive fields do not match the manifest`,
            );
          }
        }
      }

      return errors;
    };

    const storedBefore = existingVersion
      ? await readStoredCatalog(existingVersion.id)
      : { rooms: [], bundles: [], items: [], slots: [] };
    const hasDescendants = Object.values(storedBefore).some(
      (rows) => rows.length > 0,
    );
    if (existingVersion && hasDescendants) {
      const structuralErrors = inspectStored(storedBefore, 'structural');
      if (structuralErrors.length > 0) failDrift(structuralErrors);
    }

    const alreadyCurrent =
      existingVersion?.manifestRevision === manifest.manifestRevision &&
      existingVersion.manifestChecksum === checksum &&
      inspectStored(storedBefore, 'complete').length === 0;
    if (existingVersion && alreadyCurrent) {
      return {
        status: 'already-current',
        versionId: existingVersion.id,
        rooms: storedBefore.rooms.length,
        bundles: storedBefore.bundles.length,
        items: storedBefore.items.length,
        slots: storedBefore.slots.length,
        checksum,
      };
    }

    const now = new Date();
    const [version] = await tx
      .insert(catalogVersions)
      .values({
        slug: manifest.slug,
        name: manifest.name,
        gameVersion: manifest.gameVersion,
        manifestRevision: manifest.manifestRevision,
        manifestChecksum: checksum,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: catalogVersions.slug,
        set: {
          name: manifest.name,
          manifestRevision: manifest.manifestRevision,
          manifestChecksum: checksum,
          updatedAt: now,
        },
      })
      .returning({ id: catalogVersions.id });

    if (!version) throw new Error('Catalog version upsert returned no row');

    const roomOrderChanged = storedBefore.rooms.some((storedRoom) => {
      const expected = manifest.rooms.find(
        (room) => room.slug === storedRoom.slug,
      );
      return expected && expected.sortOrder !== storedRoom.sortOrder;
    });
    if (roomOrderChanged) {
      await tx
        .update(catalogRooms)
        .set({ sortOrder: sql`${catalogRooms.sortOrder} + 10000` })
        .where(eq(catalogRooms.catalogVersionId, version.id));
    }

    for (const room of manifest.rooms) {
      await tx
        .insert(catalogRooms)
        .values({
          catalogVersionId: version.id,
          slug: room.slug,
          name: room.name,
          completionReward: room.completionReward,
          sortOrder: room.sortOrder,
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [catalogRooms.catalogVersionId, catalogRooms.slug],
          set: {
            name: room.name,
            completionReward: room.completionReward,
            sortOrder: room.sortOrder,
            updatedAt: now,
          },
        });
    }

    for (const item of Object.values(manifest.items)) {
      await tx
        .insert(catalogItems)
        .values({
          catalogVersionId: version.id,
          slug: item.slug,
          name: item.name,
          category: item.category,
          availability: {
            seasons: [...item.availability.seasons],
            details: item.availability.details,
          },
          updatedAt: now,
        })
        .onConflictDoUpdate({
          target: [catalogItems.catalogVersionId, catalogItems.slug],
          set: {
            name: item.name,
            category: item.category,
            availability: {
              seasons: [...item.availability.seasons],
              details: item.availability.details,
            },
            updatedAt: now,
          },
        });
    }

    const storedRooms = await tx
      .select({ id: catalogRooms.id, slug: catalogRooms.slug })
      .from(catalogRooms)
      .where(eq(catalogRooms.catalogVersionId, version.id));
    const roomIdBySlug = new Map(
      storedRooms.map((room) => [room.slug, room.id]),
    );

    for (const room of manifest.rooms) {
      const roomId = roomIdBySlug.get(room.slug);
      if (!roomId) throw new Error(`Failed to resolve room ${room.slug}`);
      const oldRoom = storedBefore.rooms.find(
        (candidate) => candidate.slug === room.slug,
      );
      const existingBundlesForRoom = oldRoom
        ? storedBefore.bundles.filter(
            (bundle) => bundle.catalogRoomId === oldRoom.id,
          )
        : [];
      const bundleOrderChanged = existingBundlesForRoom.some((storedBundle) => {
        const expected = room.bundles.find(
          (bundle) => bundle.slug === storedBundle.slug,
        );
        return expected && expected.sortOrder !== storedBundle.sortOrder;
      });
      if (bundleOrderChanged) {
        await tx
          .update(catalogBundles)
          .set({ sortOrder: sql`${catalogBundles.sortOrder} + 10000` })
          .where(eq(catalogBundles.catalogRoomId, roomId));
      }
      for (const bundle of room.bundles) {
        await tx
          .insert(catalogBundles)
          .values({
            catalogRoomId: roomId,
            slug: bundle.slug,
            name: bundle.name,
            completionReward: bundle.completionReward,
            requiredSlots: bundle.requiredSlots,
            sortOrder: bundle.sortOrder,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: [catalogBundles.catalogRoomId, catalogBundles.slug],
            set: {
              name: bundle.name,
              completionReward: bundle.completionReward,
              sortOrder: bundle.sortOrder,
              updatedAt: now,
            },
          });
      }
    }

    const storedItems = await tx
      .select({ id: catalogItems.id, slug: catalogItems.slug })
      .from(catalogItems)
      .where(eq(catalogItems.catalogVersionId, version.id));
    const itemIdBySlug = new Map(
      storedItems.map((item) => [item.slug, item.id]),
    );
    const roomIds = [...roomIdBySlug.values()];
    const storedBundles = await tx
      .select({
        id: catalogBundles.id,
        slug: catalogBundles.slug,
        catalogRoomId: catalogBundles.catalogRoomId,
      })
      .from(catalogBundles)
      .where(inArray(catalogBundles.catalogRoomId, roomIds));
    const bundleIdByKey = new Map(
      storedBundles.map((bundle) => {
        const roomSlug = storedRooms.find(
          (room) => room.id === bundle.catalogRoomId,
        )?.slug;
        return [`${roomSlug}/${bundle.slug}`, bundle.id];
      }),
    );

    for (const room of manifest.rooms) {
      for (const bundle of room.bundles) {
        const bundleId = bundleIdByKey.get(`${room.slug}/${bundle.slug}`);
        if (!bundleId)
          throw new Error(
            `Failed to resolve bundle ${room.slug}/${bundle.slug}`,
          );
        const oldRoom = storedBefore.rooms.find(
          (candidate) => candidate.slug === room.slug,
        );
        const oldBundle = storedBefore.bundles.find(
          (candidate) =>
            candidate.slug === bundle.slug &&
            candidate.catalogRoomId === oldRoom?.id,
        );
        const existingSlots = oldBundle
          ? storedBefore.slots.filter(
              (slot) => slot.catalogBundleId === oldBundle.id,
            )
          : [];
        const slotOrderChanged = existingSlots.some((storedSlot) => {
          const expected = bundle.slots.find(
            (slot) => slot.slug === storedSlot.slug,
          );
          return expected && expected.sortOrder !== storedSlot.sortOrder;
        });
        if (slotOrderChanged) {
          await tx
            .update(bundleItemSlots)
            .set({ sortOrder: sql`${bundleItemSlots.sortOrder} + 10000` })
            .where(eq(bundleItemSlots.catalogBundleId, bundleId));
        }
        for (const slot of bundle.slots) {
          const itemId = itemIdBySlug.get(slot.itemSlug);
          if (!itemId)
            throw new Error(`Failed to resolve item ${slot.itemSlug}`);
          await tx
            .insert(bundleItemSlots)
            .values({
              catalogBundleId: bundleId,
              catalogItemId: itemId,
              slug: slot.slug,
              quantity: slot.quantity,
              minimumQuality: slot.minimumQuality,
              sortOrder: slot.sortOrder,
              updatedAt: now,
            })
            .onConflictDoUpdate({
              target: [bundleItemSlots.catalogBundleId, bundleItemSlots.slug],
              set: { sortOrder: slot.sortOrder, updatedAt: now },
            });
        }
      }
    }

    const storedAfter = await readStoredCatalog(version.id);
    const validationErrors = inspectStored(storedAfter, 'complete');
    if (validationErrors.length > 0) {
      throw new Error(
        `Stored catalog validation failed:\n- ${validationErrors.join('\n- ')}`,
      );
    }

    return {
      status: 'seeded',
      versionId: version.id,
      rooms: storedAfter.rooms.length,
      bundles: storedAfter.bundles.length,
      items: storedAfter.items.length,
      slots: storedAfter.slots.length,
      checksum,
    };
  });
};
