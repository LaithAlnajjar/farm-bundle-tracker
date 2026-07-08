export class Farm {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly userId: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt?: Date | null,
  ) {}
}
