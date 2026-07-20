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

export const farmMembershipRole = pgEnum('farm_membership_role', [
  'owner',
  'editor',
  'viewer',
]);

export const farms = pgTable('farms', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
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
