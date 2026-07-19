import { bundle, room, slot } from '../catalog.helpers';
import type { CatalogItemSlug } from '../catalog.items';
import type { CatalogRoomSource } from '../catalog.types';

export const craftsRoom = room('crafts-room', 'Crafts Room', 'Bridge Repair', [
  bundle('spring-foraging', 'Spring Foraging Bundle', 'Spring Seeds (30)', 4, [
    slot('wild-horseradish'),
    slot('daffodil'),
    slot('leek'),
    slot('dandelion'),
  ]),
  bundle('summer-foraging', 'Summer Foraging Bundle', 'Summer Seeds (30)', 3, [
    slot('grape'),
    slot('spice-berry'),
    slot('sweet-pea'),
  ]),
  bundle('fall-foraging', 'Fall Foraging Bundle', 'Fall Seeds (30)', 4, [
    slot('common-mushroom'),
    slot('wild-plum'),
    slot('hazelnut'),
    slot('blackberry'),
  ]),
  bundle('winter-foraging', 'Winter Foraging Bundle', 'Winter Seeds (30)', 4, [
    slot('winter-root'),
    slot('crystal-fruit'),
    slot('snow-yam'),
    slot('crocus'),
  ]),
  bundle('construction', 'Construction Bundle', 'Charcoal Kiln (1)', 4, [
    slot('wood', 99, 'standard', 'wood-stack-1'),
    slot('wood', 99, 'standard', 'wood-stack-2'),
    slot('stone', 99),
    slot('hardwood', 10),
  ]),
  bundle(
    'exotic-foraging',
    'Exotic Foraging Bundle',
    "Autumn's Bounty (5)",
    5,
    [
      slot('coconut'),
      slot('cactus-fruit'),
      slot('cave-carrot'),
      slot('red-mushroom'),
      slot('purple-mushroom'),
      slot('maple-syrup'),
      slot('oak-resin'),
      slot('pine-tar'),
      slot('morel'),
    ],
  ),
]) satisfies CatalogRoomSource<CatalogItemSlug>;
