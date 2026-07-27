import { relations, sql } from 'drizzle-orm';
import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { users } from '@/modules/users/infrastructure/persistence/drizzle/users.schema';
import {
  bundleItemSlots,
  catalogVersions,
} from '@/modules/catalogs/infrastructure/persistence/drizzle/catalogs.schema';

export const farmMembershipRole = pgEnum('farm_membership_role', [
  'owner',
  'editor',
  'viewer',
]);

export const farmSeason = pgEnum('farm_season', [
  'spring',
  'summer',
  'fall',
  'winter',
]);

export const farms = pgTable('farms', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  catalogVersionId: integer('catalog_version_id')
    .notNull()
    .references(() => catalogVersions.id, { onDelete: 'restrict' }),
  currentSeason: farmSeason('current_season').notNull().default('spring'),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const farmMemberships = pgTable(
  'farm_memberships',
  {
    id: serial('id').primaryKey(),
    farmId: integer('farm_id')
      .notNull()
      .references(() => farms.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    role: farmMembershipRole('role').notNull(),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    unique('farm_memberships_farm_user_unique').on(table.farmId, table.userId),
    uniqueIndex('farm_memberships_one_owner_per_farm_unique')
      .on(table.farmId)
      .where(sql`${table.role} = 'owner'`),
    index('farm_memberships_user_id_idx').on(table.userId),
    index('farm_memberships_farm_id_idx').on(table.farmId),
  ],
);

export const farmItemCollections = pgTable(
  'farm_item_collections',
  {
    id: serial('id').primaryKey(),
    farmId: integer('farm_id')
      .notNull()
      .references(() => farms.id, { onDelete: 'cascade' }),
    bundleItemSlotId: integer('bundle_item_slot_id')
      .notNull()
      .references(() => bundleItemSlots.id, { onDelete: 'restrict' }),
    collectedByUserId: integer('collected_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    collectedAt: timestamp('collected_at').notNull().defaultNow(),
  },
  (table) => [
    unique('farm_item_collections_farm_slot_unique').on(
      table.farmId,
      table.bundleItemSlotId,
    ),
    index('farm_item_collections_farm_id_idx').on(table.farmId),
    index('farm_item_collections_collector_idx').on(table.collectedByUserId),
  ],
);

export const farmItemClaims = pgTable(
  'farm_item_claims',
  {
    id: serial('id').primaryKey(),
    farmId: integer('farm_id')
      .notNull()
      .references(() => farms.id, { onDelete: 'cascade' }),
    bundleItemSlotId: integer('bundle_item_slot_id')
      .notNull()
      .references(() => bundleItemSlots.id, { onDelete: 'restrict' }),
    claimantMembershipId: integer('claimant_membership_id')
      .notNull()
      .references(() => farmMemberships.id, { onDelete: 'cascade' }),
    claimedAt: timestamp('claimed_at').notNull().defaultNow(),
  },
  (table) => [
    unique('farm_item_claims_farm_slot_unique').on(
      table.farmId,
      table.bundleItemSlotId,
    ),
    index('farm_item_claims_farm_id_idx').on(table.farmId),
    index('farm_item_claims_claimant_idx').on(table.claimantMembershipId),
  ],
);

export const farmInvites = pgTable(
  'farm_invites',
  {
    id: serial('id').primaryKey(),
    farmId: integer('farm_id')
      .notNull()
      .references(() => farms.id, { onDelete: 'cascade' }),
    createdByUserId: integer('created_by_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    revokedAt: timestamp('revoked_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    unique('farm_invites_token_hash_unique').on(table.tokenHash),
    index('farm_invites_farm_id_idx').on(table.farmId),
    index('farm_invites_created_by_user_id_idx').on(table.createdByUserId),
  ],
);

export const farmRelations = relations(farms, ({ many }) => ({
  memberships: many(farmMemberships),
  invites: many(farmInvites),
  collections: many(farmItemCollections),
  claims: many(farmItemClaims),
}));

export const farmMembershipRelations = relations(
  farmMemberships,
  ({ one }) => ({
    farm: one(farms, {
      fields: [farmMemberships.farmId],
      references: [farms.id],
    }),
    user: one(users, {
      fields: [farmMemberships.userId],
      references: [users.id],
    }),
  }),
);

export const farmInviteRelations = relations(farmInvites, ({ one }) => ({
  farm: one(farms, {
    fields: [farmInvites.farmId],
    references: [farms.id],
  }),
  creator: one(users, {
    fields: [farmInvites.createdByUserId],
    references: [users.id],
  }),
}));
