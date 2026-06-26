import { Module } from '@nestjs/common';
import { DrizzleModule } from '@/infrastructure/database/drizzle/drizzle.module';
import { UsersModule } from '@/modules/users/users.module';
import { LogoutUseCase } from './application/logoutUseCase';
import { RefreshAccessTokenUseCase } from './application/refreshAccessTokenUseCase';
import { RegisterUserUseCase } from './application/registerUserUseCase';
import { SignInUserUseCase } from './application/signInUserUseCase';
import {
  AUTH_CONFIG,
  PASSWORD_HASHER,
  REFRESH_TOKEN_GENERATOR,
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_HASHER,
  TOKEN_ISSUER,
} from './auth.tokens';
import { createAuthConfig } from './infrastructure/auth.config';
import { BcryptPasswordHasher } from './infrastructure/bcryptPasswordHasher';
import { CryptoRefreshTokenGenerator } from './infrastructure/cryptoRefreshTokenGenerator';
import { JwtTokenIssuer } from './infrastructure/jwtTokenIssuer';
import { DrizzleRefreshTokenRepository } from './infrastructure/repositories/refreshToken.repository';
import { Sha256TokenHasher } from './infrastructure/sha256TokenHasher';
import { LogoutController } from './presentation/logout.controller';
import { RefreshController } from './presentation/refresh.controller';
import { SignInController } from './presentation/signIn.controller';

@Module({
  imports: [DrizzleModule, UsersModule],
  controllers: [SignInController, RefreshController, LogoutController],
  providers: [
    { provide: AUTH_CONFIG, useFactory: createAuthConfig },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKEN_ISSUER, useClass: JwtTokenIssuer },
    { provide: TOKEN_HASHER, useClass: Sha256TokenHasher },
    {
      provide: REFRESH_TOKEN_GENERATOR,
      useClass: CryptoRefreshTokenGenerator,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: DrizzleRefreshTokenRepository,
    },
    RegisterUserUseCase,
    SignInUserUseCase,
    RefreshAccessTokenUseCase,
    LogoutUseCase,
  ],
  exports: [RegisterUserUseCase, SignInUserUseCase],
})
export class AuthModule {}
