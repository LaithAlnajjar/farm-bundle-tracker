import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { SignInUserUseCase } from '../application/signInUserUseCase';
import { AUTH_CONFIG } from '../auth.tokens';
import type { AuthConfig } from '../domain/interfaces/authConfig';
import { SignInRequestDto, type SignInResponseDto } from './dtos';
import { setRefreshTokenCookie } from './helpers/refreshTokenCookie';

@Controller('auth/signin')
export class SignInController {
  constructor(
    private readonly signInUseCase: SignInUserUseCase,
    @Inject(AUTH_CONFIG) private readonly authConfig: AuthConfig,
  ) {}

  @Post()
  async signIn(
    @Body() dto: SignInRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignInResponseDto> {
    const result = await this.signInUseCase.execute(dto);
    setRefreshTokenCookie(res, result.refreshToken, this.authConfig);

    return {
      id: result.id,
      email: result.email,
      accessToken: result.accessToken,
    };
  }
}
