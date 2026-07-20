import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { FarmInviteTokenService } from '../domain/interfaces/farmInviteTokenService';
import type { FarmCollaborationRepository } from '../domain/repositories/farmCollaboration.repository';
import {
  FARM_COLLABORATION_REPOSITORY,
  FARM_INVITE_TOKEN_SERVICE,
} from '../farms.tokens';

export type FarmInvitePreview = { farmName: string; expiresAt: Date };

@Injectable()
export class PreviewFarmInviteUseCase {
  constructor(
    @Inject(FARM_COLLABORATION_REPOSITORY)
    private readonly collaborationRepository: FarmCollaborationRepository,
    @Inject(FARM_INVITE_TOKEN_SERVICE)
    private readonly tokenService: FarmInviteTokenService,
  ) {}

  async execute(token: string): Promise<FarmInvitePreview> {
    const lookup = await this.collaborationRepository.findInviteByTokenHash(
      this.tokenService.hash(token),
    );
    const now = new Date();
    if (!lookup?.invite.isActive(now)) {
      throw new NotFoundException('Farm invite is invalid or expired');
    }
    return { farmName: lookup.farmName, expiresAt: lookup.invite.expiresAt };
  }
}
