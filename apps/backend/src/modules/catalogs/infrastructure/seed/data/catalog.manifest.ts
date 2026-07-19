import { catalogItems, type CatalogItemSlug } from './catalog.items';
import type { CatalogManifest, CatalogRoomSource } from './catalog.types';
import { boilerRoom } from './rooms/boiler-room';
import { bulletinBoard } from './rooms/bulletin-board';
import { craftsRoom } from './rooms/crafts-room';
import { fishTank } from './rooms/fish-tank';
import { pantry } from './rooms/pantry';
import { vault } from './rooms/vault';

const rooms: readonly CatalogRoomSource<CatalogItemSlug>[] = [
  craftsRoom,
  pantry,
  fishTank,
  boilerRoom,
  bulletinBoard,
  vault,
];

const items: CatalogManifest['items'] = Object.fromEntries(
  Object.entries(catalogItems).map(([slug, definition]) => [
    slug,
    { slug, ...definition },
  ]),
);

export const standardCatalogManifest: CatalogManifest = {
  slug: 'standard-community-center-1-6-15',
  name: 'Standard Community Center (1.6.15)',
  gameVersion: '1.6.15',
  manifestRevision: '2026-07-19.1',
  items,
  rooms: rooms.map((roomDefinition, roomIndex) => ({
    ...roomDefinition,
    sortOrder: roomIndex + 1,
    bundles: roomDefinition.bundles.map((bundleDefinition, bundleIndex) => ({
      ...bundleDefinition,
      sortOrder: bundleIndex + 1,
      slots: bundleDefinition.slots.map((slotDefinition, slotIndex) => ({
        ...slotDefinition,
        sortOrder: slotIndex + 1,
      })),
    })),
  })),
};
