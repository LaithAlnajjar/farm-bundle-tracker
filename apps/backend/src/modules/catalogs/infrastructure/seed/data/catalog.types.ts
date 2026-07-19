export const catalogItemCategories = [
  'crops',
  'forage',
  'fish',
  'artisan_goods',
  'animal_products',
  'minerals_gems',
  'monster_loot',
  'cooking_items',
  'tree_products',
  'specialty_items',
  'currency',
] as const;

export type CatalogItemCategory = (typeof catalogItemCategories)[number];

export const catalogSeasons = ['spring', 'summer', 'fall', 'winter'] as const;
export type CatalogSeason = (typeof catalogSeasons)[number];

export const catalogItemQualities = [
  'standard',
  'silver',
  'gold',
  'iridium',
] as const;
export type CatalogItemQuality = (typeof catalogItemQualities)[number];

export type CatalogItemDefinition = {
  name: string;
  category: CatalogItemCategory;
  availability: {
    seasons: readonly CatalogSeason[];
    details: string;
  };
};

export type CatalogSlotSource<ItemSlug extends string = string> = {
  slug: string;
  itemSlug: ItemSlug;
  quantity: number;
  minimumQuality: CatalogItemQuality;
};

export type CatalogBundleSource<ItemSlug extends string = string> = {
  slug: string;
  name: string;
  completionReward: string;
  requiredSlots: number;
  slots: readonly CatalogSlotSource<ItemSlug>[];
};

export type CatalogRoomSource<ItemSlug extends string = string> = {
  slug: string;
  name: string;
  completionReward: string;
  bundles: readonly CatalogBundleSource<ItemSlug>[];
};

export type CatalogManifest = {
  slug: string;
  name: string;
  gameVersion: string;
  manifestRevision: string;
  items: Readonly<Record<string, CatalogItemDefinition & { slug: string }>>;
  rooms: readonly (Omit<CatalogRoomSource, 'bundles'> & {
    sortOrder: number;
    bundles: readonly (Omit<CatalogBundleSource, 'slots'> & {
      sortOrder: number;
      slots: readonly (CatalogSlotSource & { sortOrder: number })[];
    })[];
  })[];
};
