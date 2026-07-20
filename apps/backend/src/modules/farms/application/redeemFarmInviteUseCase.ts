import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Farm } from '../domain/entities/farm';
import type { FarmInviteTokenService } from '../domain/interfaces/farmInviteTokenService';
import type { FarmCollaborationRepository } from '../domain/repositories/farmCollaboration.repository';
import {
  FARM_COLLABORATION_REPOSITORY,
  FARM_INVITE_TOKEN_SERVICE,
} from '../farms.tokens';

@Injectable()
export class RedeemFarmInviteUseCase {
  constructor(
    @Inject(FARM_COLLABORATION_REPOSITORY)
    private readonly collaborationRepository: FarmCollaborationRepository,
    @Inject(FARM_INVITE_TOKEN_SERVICE)
    private readonly tokenService: FarmInviteTokenService,
  ) {}

  async execute(token: string, userId: number): Promise<Farm> {
    const farm = await this.collaborationRepository.redeemInvite(
      this.tokenService.hash(token),
      userId,
      new Date(),
    );
    if (!farm) throw new NotFoundException('Farm invite is invalid or expired');
    return farm;
  }
}
