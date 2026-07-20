export class FarmInvite {
  constructor(
    public readonly id: number,
    public readonly farmId: number,
    public readonly createdByUserId: number,
    public readonly creatorUsername: string,
    public readonly expiresAt: Date,
    public readonly revokedAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  isActive(at: Date): boolean {
    return this.revokedAt === null && this.expiresAt.getTime() > at.getTime();
  }
}
