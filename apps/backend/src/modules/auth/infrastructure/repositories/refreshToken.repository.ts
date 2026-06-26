import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { type DBClient } from '@/infrastructure/database/drizzle/db';
import { InjectDb } from '@/infrastructure/database/drizzle/drizzle.provider';
import { RefreshToken } from '../../domain/entities/refreshToken';
import { RefreshTokenRepository } from '../../domain/repositories/refreshToken.repository';
import { refreshTokens } from '../persistence/drizzle/refreshTokens.schema';

@Injectable()
export class DrizzleRefreshTokenRepository implements RefreshTokenRepository {
  constructor(@InjectDb() private readonly db: DBClient) {}

  async create(session: {
    userId: number;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<{ id: number }> {
    const [row] = await this.db
      .insert(refreshTokens)
      .values({
        userId: session.userId,
        tokenHash: session.tokenHash,
        expiresAt: session.expiresAt,
      })
      .returning({ id: refreshTokens.id });

    return { id: row.id };
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const [row] = await this.db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash));

    return row ? this.toEntity(row) : null;
  }

  async markReplaced(id: number, replacedById: number): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ replacedById })
      .where(eq(refreshTokens.id, id));
  }

  async revoke(id: number): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, id));
  }

  async revokeAllForUser(userId: number): Promise<void> {
    await this.db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.userId, userId));
  }

  private toEntity(row: typeof refreshTokens.$inferSelect): RefreshToken {
    return new RefreshToken(
      row.id,
      row.userId,
      row.tokenHash,
      row.expiresAt,
      row.revokedAt,
      row.replacedById,
      row.createdAt,
    );
  }
}
