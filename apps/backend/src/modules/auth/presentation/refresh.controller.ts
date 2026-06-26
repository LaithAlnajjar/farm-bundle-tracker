import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { RefreshAccessTokenUseCase } from '../application/refreshAccessTokenUseCase';
import { AUTH_CONFIG } from '../auth.tokens';
import type { AuthConfig } from '../domain/interfaces/authConfig';
import { InvalidRefreshTokenError } from '../domain/errors/invalidRefreshToken.error';
import {
  setRefreshTokenCookie,
  getRefreshTokenFromRequest,
} from './helpers/refreshTokenCookie';
import type { RefreshResponseDto } from './dtos';

@Controller('auth/refresh')
export class RefreshController {
  constructor(
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
    @Inject(AUTH_CONFIG) private readonly authConfig: AuthConfig,
  ) {}

  @Post()
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponseDto> {
    const refreshToken = getRefreshTokenFromRequest(req, this.authConfig);

    if (!refreshToken) {
      throw new InvalidRefreshTokenError();
    }

    const result = await this.refreshAccessTokenUseCase.execute(refreshToken);
    setRefreshTokenCookie(res, result.refreshToken, this.authConfig);

    return { accessToken: result.accessToken };
  }
}
