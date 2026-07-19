import { bundle, room, slot } from '../catalog.helpers';
import type { CatalogItemSlug } from '../catalog.items';
import type { CatalogRoomSource } from '../catalog.types';

export const fishTank = room(
  'fish-tank',
  'Fish Tank',
  'Glittering Boulder Removed',
  [
    bundle('river-fish', 'River Fish Bundle', 'Deluxe Bait (30)', 4, [
      slot('sunfish'),
      slot('catfish'),
      slot('shad'),
      slot('tiger-trout'),
    ]),
    bundle('lake-fish', 'Lake Fish Bundle', 'Dressed Spinner (1)', 4, [
      slot('largemouth-bass'),
      slot('carp'),
      slot('bullhead'),
      slot('sturgeon'),
    ]),
    bundle('ocean-fish', 'Ocean Fish Bundle', 'Warp Totem: Beach (5)', 4, [
      slot('sardine'),
      slot('tuna'),
      slot('red-snapper'),
      slot('tilapia'),
    ]),
    bundle('night-fishing', 'Night Fishing Bundle', 'Glow Ring (1)', 3, [
      slot('walleye'),
      slot('bream'),
      slot('eel'),
    ]),
    bundle('crab-pot', 'Crab Pot Bundle', 'Crab Pot (3)', 5, [
      slot('lobster'),
      slot('crayfish'),
      slot('crab'),
      slot('cockle'),
      slot('mussel'),
      slot('shrimp'),
      slot('snail'),
      slot('periwinkle'),
      slot('oyster'),
      slot('clam'),
    ]),
    bundle(
      'specialty-fish',
      'Specialty Fish Bundle',
      "Dish O' The Sea (5)",
      4,
      [
        slot('pufferfish'),
        slot('ghostfish'),
        slot('sandfish'),
        slot('woodskip'),
      ],
    ),
  ],
) satisfies CatalogRoomSource<CatalogItemSlug>;
