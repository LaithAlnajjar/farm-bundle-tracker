import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  timestamp,
  integer,
  jsonb,
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
]);

export const catalogVersions = pgTable('catalog_versions', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  gameVersion: varchar('game_version', { length: 255 }).notNull(),
  deactivatedAt: timestamp('deactivated_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const catalogRooms = pgTable('catalog_rooms', {
  id: serial('id').primaryKey(),
  catalogVersionId: integer('catalog_version_id').references(
    () => catalogVersions.id,
    { onDelete: 'set null' },
  ),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  completionReward: varchar('completion_reward', { length: 255 }),
  sortOrder: integer('sort_order').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const catalogBundles = pgTable('catalog_bundles', {
  id: serial('id').primaryKey(),
  catalogRoomId: integer('catalog_room_id').references(() => catalogRooms.id, {
    onDelete: 'set null',
  }),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  completionReward: varchar('completion_reward', { length: 255 }),
  sortOrder: integer('sort_order').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const catalogItems = pgTable('catalog_items', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  category: catalogItemCategory('category').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
