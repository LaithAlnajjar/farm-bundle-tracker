import { Controller, HttpCode, Inject, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { LogoutUseCase } from '../application/logoutUseCase';
import { AUTH_CONFIG } from '../auth.tokens';
import type { AuthConfig } from '../domain/interfaces/authConfig';
import {
  clearRefreshTokenCookie,
  getRefreshTokenFromRequest,
} from './helpers/refreshTokenCookie';

@Controller('auth/logout')
export class LogoutController {
  constructor(
    private readonly logoutUseCase: LogoutUseCase,
    @Inject(AUTH_CONFIG) private readonly authConfig: AuthConfig,
  ) {}

  @Post()
  @HttpCode(204)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const refreshToken = getRefreshTokenFromRequest(req, this.authConfig);

    if (refreshToken) {
      await this.logoutUseCase.execute(refreshToken);
    }

    clearRefreshTokenCookie(res, this.authConfig);
  }
}
