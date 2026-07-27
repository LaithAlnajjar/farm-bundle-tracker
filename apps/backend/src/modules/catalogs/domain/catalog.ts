export type CatalogItemAvailability = {
  seasons: Array<'spring' | 'summer' | 'fall' | 'winter'>;
  details: string;
};

export type CatalogItemCategory =
  | 'crops'
  | 'forage'
  | 'fish'
  | 'artisan_goods'
  | 'animal_products'
  | 'minerals_gems'
  | 'monster_loot'
  | 'cooking_items'
  | 'tree_products'
  | 'specialty_items'
  | 'currency';

export type CatalogItemQuality = 'standard' | 'silver' | 'gold' | 'iridium';

export type CatalogSlot = {
  id: number;
  slug: string;
  sortOrder: number;
  quantity: number;
  minimumQuality: CatalogItemQuality;
  item: {
    id: number;
    slug: string;
    name: string;
    category: CatalogItemCategory;
    availability: CatalogItemAvailability;
  };
};

export type CatalogBundle = {
  id: number;
  slug: string;
  name: string;
  completionReward: string;
  requiredSlots: number;
  sortOrder: number;
  slots: CatalogSlot[];
};

export type CatalogRoom = {
  id: number;
  slug: string;
  name: string;
  completionReward: string;
  sortOrder: number;
  bundles: CatalogBundle[];
};

export type Catalog = {
  id: number;
  slug: string;
  name: string;
  gameVersion: string;
  manifestRevision: string;
  rooms: CatalogRoom[];
};
