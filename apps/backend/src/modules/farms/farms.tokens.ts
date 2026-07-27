import { InjectionToken } from '@nestjs/common';
import { FarmRepository } from './domain/repositories/farm.repository';
import type { FarmCollaborationRepository } from './domain/repositories/farmCollaboration.repository';
import type { FarmInviteTokenService } from './domain/interfaces/farmInviteTokenService';
import type { FarmBoardRepository } from './domain/repositories/farmBoard.repository';
import type { FarmListReadRepository } from './domain/repositories/farmListRead.repository';

export const FARM_REPOSITORY: InjectionToken<FarmRepository> =
  Symbol('FARM_REPOSITORY');
export const FARM_COLLABORATION_REPOSITORY: InjectionToken<FarmCollaborationRepository> =
  Symbol('FARM_COLLABORATION_REPOSITORY');
export const FARM_INVITE_TOKEN_SERVICE: InjectionToken<FarmInviteTokenService> =
  Symbol('FARM_INVITE_TOKEN_SERVICE');
export const FARM_BOARD_REPOSITORY: InjectionToken<FarmBoardRepository> =
  Symbol('FARM_BOARD_REPOSITORY');
export const FARM_LIST_READ_REPOSITORY: InjectionToken<FarmListReadRepository> =
  Symbol('FARM_LIST_READ_REPOSITORY');
