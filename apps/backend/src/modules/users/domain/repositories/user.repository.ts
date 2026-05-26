import { User } from '../entities/user';

export interface UserRepository {
  create(user: { email: string; hashedPassword: string }): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
}
