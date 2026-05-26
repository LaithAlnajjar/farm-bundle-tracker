import { DrizzleModule } from '@/infrastructure/database/drizzle/drizzle.module';
import { Module } from '@nestjs/common';
import { DrizzleUserRepository } from './infrastructure/repositories/user.repository';

@Module({
  imports: [DrizzleModule],
  providers: [DrizzleUserRepository],
  exports: [DrizzleUserRepository],
})
export class UsersModule {}
