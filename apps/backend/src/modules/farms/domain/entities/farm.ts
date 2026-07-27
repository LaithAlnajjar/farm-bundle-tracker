export class Farm {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly userId: number,
    public readonly catalogVersionId: number,
    public readonly currentSeason: FarmSeason,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt?: Date | null,
    public readonly membershipRole?: FarmRole,
  ) {}
}

export type FarmRole = 'owner' | 'editor' | 'viewer';
export type FarmSeason = 'spring' | 'summer' | 'fall' | 'winter';
