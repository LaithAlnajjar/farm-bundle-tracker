import type { FarmRole } from './farm';

export class FarmMembership {
  constructor(
    public readonly id: number,
    public readonly farmId: number,
    public readonly userId: number,
    public readonly username: string,
    public readonly email: string,
    public readonly role: FarmRole,
    public readonly joinedAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
