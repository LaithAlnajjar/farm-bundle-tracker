import {
  farmInvites,
  farmMemberships,
} from '@/modules/farms/infrastructure/persistence/drizzle/farms.schema';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  hashedPassword: text('hashed_password').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userRelations = relations(users, ({ many }) => ({
  farmMemberships: many(farmMemberships),
  createdFarmInvites: many(farmInvites),
}));
