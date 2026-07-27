import type {
  CatalogItemAvailability,
  CatalogItemCategory,
  CatalogItemQuality,
} from '../../domain/catalog';

export type CatalogSlotResponseDto = {
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

export type CatalogBundleResponseDto = {
  id: number;
  slug: string;
  name: string;
  completionReward: string;
  requiredSlots: number;
  sortOrder: number;
  slots: CatalogSlotResponseDto[];
};

export type CatalogRoomResponseDto = {
  id: number;
  slug: string;
  name: string;
  completionReward: string;
  sortOrder: number;
  bundles: CatalogBundleResponseDto[];
};

export type CatalogResponseDto = {
  id: number;
  slug: string;
  name: string;
  gameVersion: string;
  manifestRevision: string;
  rooms: CatalogRoomResponseDto[];
};
