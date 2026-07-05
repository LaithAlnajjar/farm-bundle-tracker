import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { GetCurrentUserUseCase } from '../application/getCurrentUserUseCase';
import type { AuthUser } from '../domain/interfaces/authUser';
import type { MeResponseDto } from './dtos';

@Controller('auth/me')
export class MeController {
  constructor(private readonly getCurrentUserUseCase: GetCurrentUserUseCase) {}

  @Get()
  async me(@CurrentUser() user: AuthUser): Promise<MeResponseDto> {
    return this.getCurrentUserUseCase.execute(user.id);
  }
}
