import { bundle, room, slot } from '../catalog.helpers';
import type { CatalogItemSlug } from '../catalog.items';
import type { CatalogRoomSource } from '../catalog.types';

export const boilerRoom = room(
  'boiler-room',
  'Boiler Room',
  'Minecarts Repaired',
  [
    bundle('blacksmiths', "Blacksmith's Bundle", 'Furnace (1)', 3, [
      slot('copper-bar'),
      slot('iron-bar'),
      slot('gold-bar'),
    ]),
    bundle('geologists', "Geologist's Bundle", 'Omni Geode (5)', 4, [
      slot('quartz'),
      slot('earth-crystal'),
      slot('frozen-tear'),
      slot('fire-quartz'),
    ]),
    bundle('adventurers', "Adventurer's Bundle", 'Small Magnet Ring (1)', 2, [
      slot('slime', 99),
      slot('bat-wing', 10),
      slot('solar-essence'),
      slot('void-essence'),
    ]),
  ],
) satisfies CatalogRoomSource<CatalogItemSlug>;
