import { DrizzleModule } from '@/infrastructure/database/drizzle/drizzle.module';
import { Module } from '@nestjs/common';
import { DrizzleUserRepository } from './infrastructure/repositories/user.repository';
import { USER_REPOSITORY } from './users.tokens';

@Module({
  imports: [DrizzleModule],
  providers: [{ provide: USER_REPOSITORY, useClass: DrizzleUserRepository }],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
