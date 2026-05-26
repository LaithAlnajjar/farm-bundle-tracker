export class User {
  constructor(
    public id: number,
    public email: string,
    public hashedPassword: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
