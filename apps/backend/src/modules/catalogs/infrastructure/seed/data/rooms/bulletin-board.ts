import { bundle, room, slot } from '../catalog.helpers';
import type { CatalogItemSlug } from '../catalog.items';
import type { CatalogRoomSource } from '../catalog.types';

export const bulletinBoard = room(
  'bulletin-board',
  'Bulletin Board',
  'Friendship (2 hearts with non-datable villagers)',
  [
    bundle('chefs', "Chef's Bundle", 'Pink Cake (3)', 6, [
      slot('maple-syrup'),
      slot('fiddlehead-fern'),
      slot('truffle'),
      slot('poppy'),
      slot('maki-roll'),
      slot('fried-egg'),
    ]),
    bundle('dye', 'Dye Bundle', 'Seed Maker (1)', 6, [
      slot('red-mushroom'),
      slot('sea-urchin'),
      slot('sunflower'),
      slot('duck-feather'),
      slot('aquamarine'),
      slot('red-cabbage'),
    ]),
    bundle(
      'field-research',
      'Field Research Bundle',
      'Recycling Machine (1)',
      4,
      [
        slot('purple-mushroom'),
        slot('nautilus-shell'),
        slot('chub'),
        slot('frozen-geode'),
      ],
    ),
    bundle('fodder', 'Fodder Bundle', 'Heater (1)', 3, [
      slot('wheat', 10),
      slot('hay', 10),
      slot('apple', 3),
    ]),
    bundle('enchanters', "Enchanter's Bundle", 'Gold Bar (5)', 4, [
      slot('oak-resin'),
      slot('wine'),
      slot('rabbits-foot'),
      slot('pomegranate'),
    ]),
  ],
) satisfies CatalogRoomSource<CatalogItemSlug>;
