import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { RegisterUserUseCase } from './application';

@Module({
  imports: [UsersModule],
  providers: [RegisterUserUseCase],
  exports: [RegisterUserUseCase],
})
export class AuthModule {}
