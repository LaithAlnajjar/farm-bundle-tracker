import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from '@/modules/users/infrastructure/persistence/drizzle/users.schema';

export const farms = pgTable(
  'farms',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [index('farms_user_id_idx').on(table.userId)],
);

export const farmRelations = relations(farms, ({ one }) => ({
  owner: one(users, {
    fields: [farms.userId],
    references: [users.id],
  }),
}));
