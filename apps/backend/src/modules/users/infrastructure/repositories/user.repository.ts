import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user';
import { users } from '../persistence/drizzle/users.schema';
import { type DBClient } from '@/infrastructure/database/drizzle/db';
import { InjectDb } from '@/infrastructure/database/drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  constructor(@InjectDb() private readonly db: DBClient) {}

  async create(user: { email: string; hashedPassword: string }): Promise<void> {
    await this.db.insert(users).values({
      email: user.email,
      hashedPassword: user.hashedPassword,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return user
      ? new User(
          user.id,
          user.email,
          user.hashedPassword,
          user.createdAt,
          user.updatedAt,
        )
      : null;
  }
}
