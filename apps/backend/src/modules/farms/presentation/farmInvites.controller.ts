import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthUser } from '@/modules/auth/domain/interfaces/authUser';
import { CreateFarmInviteUseCase } from '../application/createFarmInviteUseCase';
import { ListFarmInvitesUseCase } from '../application/listFarmInvitesUseCase';
import { RevokeFarmInviteUseCase } from '../application/revokeFarmInviteUseCase';
import type { FarmInvite } from '../domain/entities/farmInvite';
import type {
  CreatedFarmInviteResponseDto,
  FarmInviteResponseDto,
} from './dtos';

@Controller('farms/:farmId/invites')
export class FarmInvitesController {
  constructor(
    private readonly createFarmInviteUseCase: CreateFarmInviteUseCase,
    private readonly listFarmInvitesUseCase: ListFarmInvitesUseCase,
    private readonly revokeFarmInviteUseCase: RevokeFarmInviteUseCase,
  ) {}

  @Post()
  async create(
    @Param('farmId', ParseIntPipe) farmId: number,
    @CurrentUser() user: AuthUser,
  ): Promise<CreatedFarmInviteResponseDto> {
    const result = await this.createFarmInviteUseCase.execute(farmId, user.id);
    return { ...this.toResponse(result.invite), token: result.token };
  }

  @Get()
  async list(
    @Param('farmId', ParseIntPipe) farmId: number,
    @CurrentUser() user: AuthUser,
  ): Promise<FarmInviteResponseDto[]> {
    const invites = await this.listFarmInvitesUseCase.execute(farmId, user.id);
    return invites.map((invite) => this.toResponse(invite));
  }

  @Delete(':inviteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revoke(
    @Param('farmId', ParseIntPipe) farmId: number,
    @Param('inviteId', ParseIntPipe) inviteId: number,
    @CurrentUser() user: AuthUser,
  ): Promise<void> {
    await this.revokeFarmInviteUseCase.execute(farmId, inviteId, user.id);
  }

  private toResponse(invite: FarmInvite): FarmInviteResponseDto {
    const now = new Date();
    return {
      id: invite.id,
      createdByUserId: invite.createdByUserId,
      creatorUsername: invite.creatorUsername,
      expiresAt: invite.expiresAt.toISOString(),
      revokedAt: invite.revokedAt?.toISOString() ?? null,
      createdAt: invite.createdAt.toISOString(),
      status:
        invite.revokedAt !== null
          ? 'revoked'
          : invite.expiresAt <= now
            ? 'expired'
            : 'active',
    };
  }
}
