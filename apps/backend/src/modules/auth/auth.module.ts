import { Module } from '@nestjs/common';
import { UsersModule } from '@/modules/users/users.module';
import { RegisterUserUseCase } from './application/registerUserUseCase';
import { SignInUserUseCase } from './application/signInUserUseCase';
import { AUTH_CONFIG, PASSWORD_HASHER, TOKEN_ISSUER } from './auth.tokens';
import { createAuthConfig } from './infrastructure/auth.config';
import { BcryptPasswordHasher } from './infrastructure/bcryptPasswordHasher';
import { JwtTokenIssuer } from './infrastructure/jwtTokenIssuer';
import { SignInController } from './presentation/signIn.controller';

@Module({
  imports: [UsersModule],
  controllers: [SignInController],
  providers: [
    { provide: AUTH_CONFIG, useFactory: createAuthConfig },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKEN_ISSUER, useClass: JwtTokenIssuer },
    RegisterUserUseCase,
    SignInUserUseCase,
  ],
  exports: [RegisterUserUseCase, SignInUserUseCase],
})
export class AuthModule {}
