import type {
  CatalogBundleSource,
  CatalogItemQuality,
  CatalogRoomSource,
  CatalogSlotSource,
} from './catalog.types';

export const slot = <ItemSlug extends string>(
  itemSlug: ItemSlug,
  quantity = 1,
  minimumQuality: CatalogItemQuality = 'standard',
  slug: string = itemSlug,
): CatalogSlotSource<ItemSlug> => ({
  slug,
  itemSlug,
  quantity,
  minimumQuality,
});

export const bundle = <ItemSlug extends string>(
  slug: string,
  name: string,
  completionReward: string,
  requiredSlots: number,
  slots: readonly CatalogSlotSource<ItemSlug>[],
): CatalogBundleSource<ItemSlug> => ({
  slug,
  name,
  completionReward,
  requiredSlots,
  slots,
});

export const room = <ItemSlug extends string>(
  slug: string,
  name: string,
  completionReward: string,
  bundles: readonly CatalogBundleSource<ItemSlug>[],
): CatalogRoomSource<ItemSlug> => ({
  slug,
  name,
  completionReward,
  bundles,
});
