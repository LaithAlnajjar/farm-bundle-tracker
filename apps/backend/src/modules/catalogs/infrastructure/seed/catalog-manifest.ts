import { createHash } from 'node:crypto';
import { standardCatalogManifest } from './data/catalog.manifest';
import {
  catalogItemCategories,
  catalogItemQualities,
  catalogSeasons,
  type CatalogManifest,
} from './data/catalog.types';

const stableSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const assertUnique = (
  values: readonly (string | number)[],
  label: string,
  errors: string[],
) => {
  const seen = new Set<string | number>();
  for (const value of values) {
    if (seen.has(value))
      errors.push(`${label} contains duplicate value: ${value}`);
    seen.add(value);
  }
};

const findBundle = (manifest: CatalogManifest, slug: string) =>
  manifest.rooms
    .flatMap((room) => room.bundles)
    .find((bundle) => bundle.slug === slug);

export const validateCatalogManifest = (manifest: CatalogManifest): void => {
  const errors: string[] = [];
  const items = Object.values(manifest.items);
  const bundles = manifest.rooms.flatMap((room) => room.bundles);
  const slots = bundles.flatMap((bundle) => bundle.slots);

  if (!stableSlugPattern.test(manifest.slug))
    errors.push(`invalid catalog slug: ${manifest.slug}`);
  if (!manifest.name.trim()) errors.push('catalog name is required');
  if (!manifest.gameVersion.trim()) errors.push('game version is required');
  if (!manifest.manifestRevision.trim())
    errors.push('manifest revision is required');
  if (manifest.rooms.length !== 6)
    errors.push(`expected 6 rooms, found ${manifest.rooms.length}`);
  if (bundles.length !== 30)
    errors.push(`expected 30 bundles, found ${bundles.length}`);
  if (slots.length !== 129)
    errors.push(`expected 129 possible slots, found ${slots.length}`);

  assertUnique(
    items.map((item) => item.slug),
    'catalog item slugs',
    errors,
  );
  assertUnique(
    manifest.rooms.map((room) => room.slug),
    'room slugs',
    errors,
  );
  assertUnique(
    manifest.rooms.map((room) => room.sortOrder),
    'room display orders',
    errors,
  );

  const referencedItems = new Set<string>();
  for (const item of items) {
    if (!stableSlugPattern.test(item.slug))
      errors.push(`invalid item slug: ${item.slug}`);
    if (!item.name.trim()) errors.push(`item ${item.slug} has no display name`);
    if (!catalogItemCategories.includes(item.category))
      errors.push(`item ${item.slug} has invalid category`);
    if (!item.availability.details.trim())
      errors.push(`item ${item.slug} has no availability details`);
    if (item.availability.seasons.length === 0)
      errors.push(`item ${item.slug} has no availability seasons`);
    assertUnique(
      item.availability.seasons,
      `item ${item.slug} seasons`,
      errors,
    );
    if (
      item.availability.seasons.some(
        (season) => !catalogSeasons.includes(season),
      )
    ) {
      errors.push(`item ${item.slug} has an invalid season`);
    }
  }

  for (const room of manifest.rooms) {
    if (!stableSlugPattern.test(room.slug))
      errors.push(`invalid room slug: ${room.slug}`);
    if (!room.name.trim() || !room.completionReward.trim())
      errors.push(`room ${room.slug} is missing descriptive data`);
    if (room.sortOrder <= 0)
      errors.push(`room ${room.slug} has invalid display order`);
    assertUnique(
      room.bundles.map((bundle) => bundle.slug),
      `bundle slugs in ${room.slug}`,
      errors,
    );
    assertUnique(
      room.bundles.map((bundle) => bundle.sortOrder),
      `bundle display orders in ${room.slug}`,
      errors,
    );

    for (const bundle of room.bundles) {
      if (!stableSlugPattern.test(bundle.slug))
        errors.push(`invalid bundle slug: ${room.slug}/${bundle.slug}`);
      if (!bundle.name.trim() || !bundle.completionReward.trim())
        errors.push(
          `bundle ${room.slug}/${bundle.slug} is missing descriptive data`,
        );
      if (
        bundle.requiredSlots <= 0 ||
        bundle.requiredSlots > bundle.slots.length
      ) {
        errors.push(
          `bundle ${room.slug}/${bundle.slug} requires ${bundle.requiredSlots} of ${bundle.slots.length} slots`,
        );
      }
      assertUnique(
        bundle.slots.map((slot) => slot.slug),
        `slot slugs in ${room.slug}/${bundle.slug}`,
        errors,
      );
      assertUnique(
        bundle.slots.map((slot) => slot.sortOrder),
        `slot display orders in ${room.slug}/${bundle.slug}`,
        errors,
      );

      for (const slot of bundle.slots) {
        if (!stableSlugPattern.test(slot.slug))
          errors.push(
            `invalid slot slug: ${room.slug}/${bundle.slug}/${slot.slug}`,
          );
        if (!manifest.items[slot.itemSlug])
          errors.push(
            `slot ${room.slug}/${bundle.slug}/${slot.slug} references unknown item ${slot.itemSlug}`,
          );
        if (!Number.isInteger(slot.quantity) || slot.quantity <= 0)
          errors.push(
            `slot ${room.slug}/${bundle.slug}/${slot.slug} has invalid quantity`,
          );
        if (!catalogItemQualities.includes(slot.minimumQuality))
          errors.push(
            `slot ${room.slug}/${bundle.slug}/${slot.slug} has invalid minimum quality`,
          );
        if (!Number.isInteger(slot.sortOrder) || slot.sortOrder <= 0)
          errors.push(
            `slot ${room.slug}/${bundle.slug}/${slot.slug} has invalid display order`,
          );
        referencedItems.add(slot.itemSlug);
      }
    }
  }

  for (const item of items) {
    if (!referencedItems.has(item.slug))
      errors.push(`catalog item ${item.slug} is not used by any slot`);
  }

  const expectedChoiceBundles: Record<string, [number, number]> = {
    'quality-crops': [3, 4],
    animal: [5, 6],
    artisan: [6, 12],
    'exotic-foraging': [5, 9],
    adventurers: [2, 4],
    'crab-pot': [5, 10],
  };
  for (const [slug, [required, possible]] of Object.entries(
    expectedChoiceBundles,
  )) {
    const bundle = findBundle(manifest, slug);
    if (
      !bundle ||
      bundle.requiredSlots !== required ||
      bundle.slots.length !== possible
    ) {
      errors.push(
        `known N-of-M rule mismatch for ${slug}: expected ${required} of ${possible}`,
      );
    }
  }

  const qualityCrops = findBundle(manifest, 'quality-crops');
  if (
    qualityCrops?.slots.some(
      (slot) => slot.quantity !== 5 || slot.minimumQuality !== 'gold',
    )
  ) {
    errors.push('quality-crops slots must each require 5 gold-quality items');
  }
  if (
    findBundle(manifest, 'river-fish')?.completionReward !== 'Deluxe Bait (30)'
  ) {
    errors.push('the 1.6.15 River Fish reward must be Deluxe Bait (30)');
  }
  if (
    findBundle(manifest, 'night-fishing')?.completionReward !== 'Glow Ring (1)'
  ) {
    errors.push('the 1.6.15 Night Fishing reward must be Glow Ring (1)');
  }

  if (errors.length > 0) {
    throw new Error(
      `Catalog manifest validation failed:\n- ${errors.join('\n- ')}`,
    );
  }
};

export const catalogManifestChecksum = (manifest: CatalogManifest): string =>
  createHash('sha256').update(JSON.stringify(manifest)).digest('hex');

export const loadCatalogManifest = () => {
  validateCatalogManifest(standardCatalogManifest);
  return {
    manifest: standardCatalogManifest,
    checksum: catalogManifestChecksum(standardCatalogManifest),
  };
};
