import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from '@/modules/users/infrastructure/persistence/drizzle/users.schema';

export const refreshTokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  revokedAt: timestamp('revoked_at'),
  replacedById: integer('replaced_by_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
