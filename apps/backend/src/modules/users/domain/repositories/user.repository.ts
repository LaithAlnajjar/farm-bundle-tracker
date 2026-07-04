import { User } from '../entities/user';

export interface UserRepository {
  create(user: {
    email: string;
    username: string;
    hashedPassword: string;
  }): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
}
