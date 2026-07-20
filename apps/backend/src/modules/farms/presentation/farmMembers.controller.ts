import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthUser } from '@/modules/auth/domain/interfaces/authUser';
import { AddFarmMemberUseCase } from '../application/addFarmMemberUseCase';
import { LeaveFarmUseCase } from '../application/leaveFarmUseCase';
import { ListFarmMembersUseCase } from '../application/listFarmMembersUseCase';
import { RemoveFarmMemberUseCase } from '../application/removeFarmMemberUseCase';
import { UpdateFarmMemberRoleUseCase } from '../application/updateFarmMemberRoleUseCase';
import type { FarmMembership } from '../domain/entities/farmMembership';
import {
  AddFarmMemberRequestDto,
  type FarmMemberResponseDto,
  UpdateFarmMemberRequestDto,
} from './dtos';

@Controller('farms/:farmId/members')
export class FarmMembersController {
  constructor(
    private readonly listFarmMembersUseCase: ListFarmMembersUseCase,
    private readonly addFarmMemberUseCase: AddFarmMemberUseCase,
    private readonly updateFarmMemberRoleUseCase: UpdateFarmMemberRoleUseCase,
    private readonly removeFarmMemberUseCase: RemoveFarmMemberUseCase,
    private readonly leaveFarmUseCase: LeaveFarmUseCase,
  ) {}

  @Get()
  async list(
    @Param('farmId', ParseIntPipe) farmId: number,
    @CurrentUser() user: AuthUser,
  ): Promise<FarmMemberResponseDto[]> {
    const members = await this.listFarmMembersUseCase.execute(farmId, user.id);
    return members.map((member) => this.toResponse(member));
  }

  @Post()
  async add(
    @Param('farmId', ParseIntPipe) farmId: number,
    @Body() dto: AddFarmMemberRequestDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FarmMemberResponseDto> {
    return this.toResponse(
      await this.addFarmMemberUseCase.execute({
        farmId,
        actorUserId: user.id,
        identifier: dto.identifier,
        role: dto.role ?? 'editor',
      }),
    );
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async leave(
    @Param('farmId', ParseIntPipe) farmId: number,
    @CurrentUser() user: AuthUser,
  ): Promise<void> {
    await this.leaveFarmUseCase.execute(farmId, user.id);
  }

  @Patch(':membershipId')
  async updateRole(
    @Param('farmId', ParseIntPipe) farmId: number,
    @Param('membershipId', ParseIntPipe) membershipId: number,
    @Body() dto: UpdateFarmMemberRequestDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FarmMemberResponseDto> {
    return this.toResponse(
      await this.updateFarmMemberRoleUseCase.execute({
        farmId,
        membershipId,
        actorUserId: user.id,
        role: dto.role,
      }),
    );
  }

  @Delete(':membershipId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('farmId', ParseIntPipe) farmId: number,
    @Param('membershipId', ParseIntPipe) membershipId: number,
    @CurrentUser() user: AuthUser,
  ): Promise<void> {
    await this.removeFarmMemberUseCase.execute({
      farmId,
      membershipId,
      actorUserId: user.id,
    });
  }

  private toResponse(member: FarmMembership): FarmMemberResponseDto {
    return {
      id: member.id,
      userId: member.userId,
      username: member.username,
      email: member.email,
      role: member.role,
      joinedAt: member.joinedAt.toISOString(),
    };
  }
}
