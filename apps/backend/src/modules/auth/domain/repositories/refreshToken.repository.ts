import { RefreshToken } from '../entities/refreshToken';

export interface RefreshTokenRepository {
  create(session: {
    userId: number;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<{ id: number }>;
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  markReplaced(id: number, replacedById: number): Promise<void>;
  revoke(id: number): Promise<void>;
  revokeAllForUser(userId: number): Promise<void>;
}
