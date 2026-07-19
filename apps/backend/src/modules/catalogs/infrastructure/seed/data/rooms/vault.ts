import { bundle, room, slot } from '../catalog.helpers';
import type { CatalogItemSlug } from '../catalog.items';
import type { CatalogRoomSource } from '../catalog.types';

export const vault = room('vault', 'Vault', 'Bus Repair', [
  bundle('2500g', '2,500 Bundle', 'Chocolate Cake (3)', 1, [
    slot('gold', 2500),
  ]),
  bundle('5000g', '5,000 Bundle', 'Quality Fertilizer (30)', 1, [
    slot('gold', 5000),
  ]),
  bundle('10000g', '10,000 Bundle', 'Lightning Rod (1)', 1, [
    slot('gold', 10000),
  ]),
  bundle('25000g', '25,000 Bundle', 'Crystalarium (1)', 1, [
    slot('gold', 25000),
  ]),
]) satisfies CatalogRoomSource<CatalogItemSlug>;
