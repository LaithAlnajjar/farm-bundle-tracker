import { bundle, room, slot } from '../catalog.helpers';
import type { CatalogItemSlug } from '../catalog.items';
import type { CatalogRoomSource } from '../catalog.types';

export const pantry = room('pantry', 'Pantry', 'Greenhouse', [
  bundle('spring-crops', 'Spring Crops Bundle', 'Speed-Gro (20)', 4, [
    slot('parsnip'),
    slot('green-bean'),
    slot('cauliflower'),
    slot('potato'),
  ]),
  bundle('summer-crops', 'Summer Crops Bundle', 'Quality Sprinkler (1)', 4, [
    slot('tomato'),
    slot('hot-pepper'),
    slot('blueberry'),
    slot('melon'),
  ]),
  bundle('fall-crops', 'Fall Crops Bundle', 'Bee House (1)', 4, [
    slot('corn'),
    slot('eggplant'),
    slot('pumpkin'),
    slot('yam'),
  ]),
  bundle('quality-crops', 'Quality Crops Bundle', 'Preserves Jar (1)', 3, [
    slot('parsnip', 5, 'gold'),
    slot('melon', 5, 'gold'),
    slot('pumpkin', 5, 'gold'),
    slot('corn', 5, 'gold'),
  ]),
  bundle('animal', 'Animal Bundle', 'Cheese Press (1)', 5, [
    slot('large-milk'),
    slot('large-brown-egg'),
    slot('large-white-egg'),
    slot('large-goat-milk'),
    slot('wool'),
    slot('duck-egg'),
  ]),
  bundle('artisan', 'Artisan Bundle', 'Keg (1)', 6, [
    slot('truffle-oil'),
    slot('cloth'),
    slot('goat-cheese'),
    slot('cheese'),
    slot('honey'),
    slot('jelly'),
    slot('apple'),
    slot('apricot'),
    slot('orange'),
    slot('peach'),
    slot('pomegranate'),
    slot('cherry'),
  ]),
]) satisfies CatalogRoomSource<CatalogItemSlug>;
