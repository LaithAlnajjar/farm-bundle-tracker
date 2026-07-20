import { InjectionToken } from '@nestjs/common';
import { FarmRepository } from './domain/repositories/farm.repository';
import type { FarmCollaborationRepository } from './domain/repositories/farmCollaboration.repository';
import type { FarmInviteTokenService } from './domain/interfaces/farmInviteTokenService';

export const FARM_REPOSITORY: InjectionToken<FarmRepository> =
  Symbol('FARM_REPOSITORY');
export const FARM_COLLABORATION_REPOSITORY: InjectionToken<FarmCollaborationRepository> =
  Symbol('FARM_COLLABORATION_REPOSITORY');
export const FARM_INVITE_TOKEN_SERVICE: InjectionToken<FarmInviteTokenService> =
  Symbol('FARM_INVITE_TOKEN_SERVICE');
