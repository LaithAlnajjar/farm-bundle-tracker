export class RefreshToken {
  constructor(
    public id: number,
    public userId: number,
    public tokenHash: string,
    public expiresAt: Date,
    public revokedAt: Date | null,
    public replacedById: number | null,
    public createdAt: Date,
  ) {}

  isExpired(now = new Date()): boolean {
    return this.expiresAt <= now;
  }

  isRevoked(): boolean {
    return this.revokedAt !== null;
  }

  wasReplaced(): boolean {
    return this.replacedById !== null;
  }
}
