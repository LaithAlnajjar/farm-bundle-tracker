import { relations, sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const catalogItemCategory = pgEnum('catalog_item_category', [
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
]);

export const catalogItemQuality = pgEnum('catalog_item_quality', [
  'standard',
  'silver',
  'gold',
  'iridium',
]);

export type CatalogItemAvailability = {
  seasons: Array<'spring' | 'summer' | 'fall' | 'winter'>;
  details: string;
};

export const catalogVersions = pgTable('catalog_versions', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  gameVersion: varchar('game_version', { length: 255 }).notNull(),
  manifestRevision: varchar('manifest_revision', { length: 64 }).notNull(),
  manifestChecksum: varchar('manifest_checksum', { length: 64 }).notNull(),
  deactivatedAt: timestamp('deactivated_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const catalogRooms = pgTable(
  'catalog_rooms',
  {
    id: serial('id').primaryKey(),
    catalogVersionId: integer('catalog_version_id')
      .notNull()
      .references(() => catalogVersions.id, { onDelete: 'restrict' }),
    slug: varchar('slug', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    completionReward: varchar('completion_reward', { length: 255 }).notNull(),
    sortOrder: integer('sort_order').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    unique('catalog_rooms_version_slug_unique').on(
      table.catalogVersionId,
      table.slug,
    ),
    unique('catalog_rooms_version_sort_order_unique').on(
      table.catalogVersionId,
      table.sortOrder,
    ),
    index('catalog_rooms_version_id_idx').on(table.catalogVersionId),
    check('catalog_rooms_sort_order_positive', sql`${table.sortOrder} > 0`),
  ],
);

export const catalogBundles = pgTable(
  'catalog_bundles',
  {
    id: serial('id').primaryKey(),
    catalogRoomId: integer('catalog_room_id')
      .notNull()
      .references(() => catalogRooms.id, { onDelete: 'restrict' }),
    requiredSlots: integer('required_slots').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    completionReward: varchar('completion_reward', { length: 255 }).notNull(),
    sortOrder: integer('sort_order').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    unique('catalog_bundles_room_slug_unique').on(
      table.catalogRoomId,
      table.slug,
    ),
    unique('catalog_bundles_room_sort_order_unique').on(
      table.catalogRoomId,
      table.sortOrder,
    ),
    index('catalog_bundles_room_id_idx').on(table.catalogRoomId),
    check(
      'catalog_bundles_required_slots_positive',
      sql`${table.requiredSlots} > 0`,
    ),
    check('catalog_bundles_sort_order_positive', sql`${table.sortOrder} > 0`),
  ],
);

export const catalogItems = pgTable(
  'catalog_items',
  {
    id: serial('id').primaryKey(),
    catalogVersionId: integer('catalog_version_id')
      .notNull()
      .references(() => catalogVersions.id, { onDelete: 'restrict' }),
    slug: varchar('slug', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    category: catalogItemCategory('category').notNull(),
    availability: jsonb('availability')
      .$type<CatalogItemAvailability>()
      .notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    unique('catalog_items_version_slug_unique').on(
      table.catalogVersionId,
      table.slug,
    ),
    index('catalog_items_version_id_idx').on(table.catalogVersionId),
    check(
      'catalog_items_availability_valid',
      sql`${table.availability} ? 'seasons'
        AND jsonb_array_length(
          CASE
            WHEN jsonb_typeof(${table.availability}->'seasons') = 'array'
              THEN ${table.availability}->'seasons'
            ELSE '[]'::jsonb
          END
        ) > 0
        AND COALESCE(length(btrim(${table.availability}->>'details')) > 0, false)`,
    ),
  ],
);

export const bundleItemSlots = pgTable(
  'bundle_item_slots',
  {
    id: serial('id').primaryKey(),
    catalogBundleId: integer('catalog_bundle_id')
      .notNull()
      .references(() => catalogBundles.id, { onDelete: 'restrict' }),
    catalogItemId: integer('catalog_item_id')
      .notNull()
      .references(() => catalogItems.id, { onDelete: 'restrict' }),
    slug: varchar('slug', { length: 255 }).notNull(),
    quantity: integer('quantity').notNull(),
    minimumQuality: catalogItemQuality('minimum_quality')
      .notNull()
      .default('standard'),
    sortOrder: integer('sort_order').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    unique('bundle_item_slots_bundle_slug_unique').on(
      table.catalogBundleId,
      table.slug,
    ),
    unique('bundle_item_slots_bundle_sort_order_unique').on(
      table.catalogBundleId,
      table.sortOrder,
    ),
    index('bundle_item_slots_bundle_id_idx').on(table.catalogBundleId),
    index('bundle_item_slots_item_id_idx').on(table.catalogItemId),
    check('bundle_item_slots_quantity_positive', sql`${table.quantity} > 0`),
    check('bundle_item_slots_sort_order_positive', sql`${table.sortOrder} > 0`),
  ],
);

export const catalogVersionRelations = relations(
  catalogVersions,
  ({ many }) => ({
    rooms: many(catalogRooms),
    items: many(catalogItems),
  }),
);

export const catalogRoomRelations = relations(
  catalogRooms,
  ({ one, many }) => ({
    catalogVersion: one(catalogVersions, {
      fields: [catalogRooms.catalogVersionId],
      references: [catalogVersions.id],
    }),
    bundles: many(catalogBundles),
  }),
);

export const catalogBundleRelations = relations(
  catalogBundles,
  ({ one, many }) => ({
    room: one(catalogRooms, {
      fields: [catalogBundles.catalogRoomId],
      references: [catalogRooms.id],
    }),
    itemSlots: many(bundleItemSlots),
  }),
);

export const catalogItemRelations = relations(
  catalogItems,
  ({ one, many }) => ({
    catalogVersion: one(catalogVersions, {
      fields: [catalogItems.catalogVersionId],
      references: [catalogVersions.id],
    }),
    bundleSlots: many(bundleItemSlots),
  }),
);

export const bundleItemSlotRelations = relations(
  bundleItemSlots,
  ({ one }) => ({
    bundle: one(catalogBundles, {
      fields: [bundleItemSlots.catalogBundleId],
      references: [catalogBundles.id],
    }),
    item: one(catalogItems, {
      fields: [bundleItemSlots.catalogItemId],
      references: [catalogItems.id],
    }),
  }),
);
