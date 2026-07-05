import { Module } from '@nestjs/common';
import { DrizzleModule } from '@/infrastructure/database/drizzle/drizzle.module';
import { UsersModule } from '@/modules/users/users.module';
import { LogoutUseCase } from './application/logoutUseCase';
import { RefreshAccessTokenUseCase } from './application/refreshAccessTokenUseCase';
import { GetCurrentUserUseCase } from './application/getCurrentUserUseCase';
import { RegisterUserUseCase } from './application/registerUserUseCase';
import { SignInUserUseCase } from './application/signInUserUseCase';
import { VerifyTokenUseCase } from './application/verifyTokenUseCase';
import {
  AUTH_CONFIG,
  PASSWORD_HASHER,
  REFRESH_TOKEN_GENERATOR,
  REFRESH_TOKEN_REPOSITORY,
  TOKEN_HASHER,
  TOKEN_ISSUER,
  TOKEN_VERIFIER,
} from './auth.tokens';
import { createAuthConfig } from './infrastructure/auth.config';
import { BcryptPasswordHasher } from './infrastructure/bcryptPasswordHasher';
import { CryptoRefreshTokenGenerator } from './infrastructure/cryptoRefreshTokenGenerator';
import { JwtTokenIssuer } from './infrastructure/jwtTokenIssuer';
import { JwtTokenVerifier } from './infrastructure/jwtTokenVerifier';
import { DrizzleRefreshTokenRepository } from './infrastructure/repositories/refreshToken.repository';
import { Sha256TokenHasher } from './infrastructure/sha256TokenHasher';
import { LogoutController } from './presentation/logout.controller';
import { MeController } from './presentation/me.controller';
import { RefreshController } from './presentation/refresh.controller';
import { SignInController } from './presentation/signIn.controller';
import { RegisterController } from './presentation/register.controller';
import { AuthGuard } from './presentation/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [DrizzleModule, UsersModule],
  controllers: [
    RegisterController,
    SignInController,
    RefreshController,
    LogoutController,
    MeController,
  ],
  providers: [
    { provide: AUTH_CONFIG, useFactory: createAuthConfig },
    { provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher },
    { provide: TOKEN_ISSUER, useClass: JwtTokenIssuer },
    { provide: TOKEN_VERIFIER, useClass: JwtTokenVerifier },
    { provide: TOKEN_HASHER, useClass: Sha256TokenHasher },
    {
      provide: REFRESH_TOKEN_GENERATOR,
      useClass: CryptoRefreshTokenGenerator,
    },
    {
      provide: REFRESH_TOKEN_REPOSITORY,
      useClass: DrizzleRefreshTokenRepository,
    },
    { provide: APP_GUARD, useClass: AuthGuard },
    RegisterUserUseCase,
    SignInUserUseCase,
    RefreshAccessTokenUseCase,
    LogoutUseCase,
    VerifyTokenUseCase,
    GetCurrentUserUseCase,
  ],
  exports: [RegisterUserUseCase, SignInUserUseCase],
})
export class AuthModule {}
