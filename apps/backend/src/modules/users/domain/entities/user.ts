export class User {
  constructor(
    public id: number,
    public email: string,
    public username: string,
    public hashedPassword: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
