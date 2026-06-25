import { Module } from '@nestjs/common';
import { UsersModule } from '@/modules/users/users.module';
import { RegisterUserUseCase } from './application/registerUserUseCase';
import { SignInUserUseCase } from './application/signInUserUseCase';
import { BcryptPasswordHasher } from './infrastructure/bcryptPasswordHasher';
import { PASSWORD_HASHER } from './auth.tokens';

@Module({
  imports: [UsersModule],
  providers: [
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    RegisterUserUseCase,
    SignInUserUseCase,
  ],
  exports: [RegisterUserUseCase, SignInUserUseCase],
})
export class AuthModule {}
