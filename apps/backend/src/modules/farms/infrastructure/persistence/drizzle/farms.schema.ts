import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

export const farms = pgTable('farms', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
