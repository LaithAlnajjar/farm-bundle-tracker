import { Module } from '@nestjs/common';
import { FARM_REPOSITORY } from './farms.tokens';
import { DrizzleFarmRepository } from './infrastructure/repositories/farm.repository';
import { DrizzleModule } from '@/infrastructure/database/drizzle/drizzle.module';
import { CreateFarmUseCase } from './application/createFarmUseCase';
import { DeleteFarmUseCase } from './application/deleteFarmUseCase';
import { GetFarmUseCase } from './application/getFarmUseCase';
import { ListFarmsUseCase } from './application/listFarmsUseCase';
import { UpdateFarmUseCase } from './application/updateFarmUseCase';
import { FarmsController } from './presentation/farms.controller';
import { UsersModule } from '../users/users.module';
import {
  FARM_COLLABORATION_REPOSITORY,
  FARM_INVITE_TOKEN_SERVICE,
} from './farms.tokens';
import { DrizzleFarmCollaborationRepository } from './infrastructure/repositories/farmCollaboration.repository';
import { CryptoFarmInviteTokenService } from './infrastructure/cryptoFarmInviteTokenService';
import { AddFarmMemberUseCase } from './application/addFarmMemberUseCase';
import { AuthorizeFarmActionUseCase } from './application/authorizeFarmActionUseCase';
import { CreateFarmInviteUseCase } from './application/createFarmInviteUseCase';
import { LeaveFarmUseCase } from './application/leaveFarmUseCase';
import { ListFarmInvitesUseCase } from './application/listFarmInvitesUseCase';
import { ListFarmMembersUseCase } from './application/listFarmMembersUseCase';
import { PreviewFarmInviteUseCase } from './application/previewFarmInviteUseCase';
import { RedeemFarmInviteUseCase } from './application/redeemFarmInviteUseCase';
import { RemoveFarmMemberUseCase } from './application/removeFarmMemberUseCase';
import { RevokeFarmInviteUseCase } from './application/revokeFarmInviteUseCase';
import { UpdateFarmMemberRoleUseCase } from './application/updateFarmMemberRoleUseCase';
import { FarmMembersController } from './presentation/farmMembers.controller';
import { FarmInvitesController } from './presentation/farmInvites.controller';
import { FarmInviteRedemptionController } from './presentation/farmInviteRedemption.controller';

@Module({
  imports: [DrizzleModule, UsersModule],
  providers: [
    { provide: FARM_REPOSITORY, useClass: DrizzleFarmRepository },
    {
      provide: FARM_COLLABORATION_REPOSITORY,
      useClass: DrizzleFarmCollaborationRepository,
    },
    {
      provide: FARM_INVITE_TOKEN_SERVICE,
      useClass: CryptoFarmInviteTokenService,
    },
    AddFarmMemberUseCase,
    AuthorizeFarmActionUseCase,
    CreateFarmUseCase,
    CreateFarmInviteUseCase,
    DeleteFarmUseCase,
    GetFarmUseCase,
    LeaveFarmUseCase,
    ListFarmInvitesUseCase,
    ListFarmMembersUseCase,
    ListFarmsUseCase,
    PreviewFarmInviteUseCase,
    RedeemFarmInviteUseCase,
    RemoveFarmMemberUseCase,
    RevokeFarmInviteUseCase,
    UpdateFarmUseCase,
    UpdateFarmMemberRoleUseCase,
  ],
  controllers: [
    FarmsController,
    FarmMembersController,
    FarmInvitesController,
    FarmInviteRedemptionController,
  ],
  exports: [],
})
export class FarmsModule {}
