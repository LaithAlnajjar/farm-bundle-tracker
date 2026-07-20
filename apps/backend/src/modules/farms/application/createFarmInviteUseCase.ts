import { Inject, Injectable } from '@nestjs/common';
import type { FarmInvite } from '../domain/entities/farmInvite';
import type { FarmInviteTokenService } from '../domain/interfaces/farmInviteTokenService';
import type { FarmCollaborationRepository } from '../domain/repositories/farmCollaboration.repository';
import {
  FARM_COLLABORATION_REPOSITORY,
  FARM_INVITE_TOKEN_SERVICE,
} from '../farms.tokens';
import { AuthorizeFarmActionUseCase } from './authorizeFarmActionUseCase';

const inviteLifetimeMs = 8 * 24 * 60 * 60 * 1000;

export type CreatedFarmInvite = { invite: FarmInvite; token: string };

@Injectable()
export class CreateFarmInviteUseCase {
  constructor(
    @Inject(FARM_COLLABORATION_REPOSITORY)
    private readonly collaborationRepository: FarmCollaborationRepository,
    @Inject(FARM_INVITE_TOKEN_SERVICE)
    private readonly tokenService: FarmInviteTokenService,
    private readonly authorizeFarmAction: AuthorizeFarmActionUseCase,
  ) {}

  async execute(farmId: number, userId: number): Promise<CreatedFarmInvite> {
    await this.authorizeFarmAction.execute(farmId, userId, 'manage-invites');
    const { token, hash } = this.tokenService.generate();
    const invite = await this.collaborationRepository.createInvite({
      farmId,
      createdByUserId: userId,
      tokenHash: hash,
      expiresAt: new Date(Date.now() + inviteLifetimeMs),
    });
    return { invite, token };
  }
}
