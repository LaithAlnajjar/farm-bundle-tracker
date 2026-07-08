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
import type { Farm } from '../domain/entities/farm';
import { CreateFarmUseCase } from '../application/createFarmUseCase';
import { DeleteFarmUseCase } from '../application/deleteFarmUseCase';
import { GetFarmUseCase } from '../application/getFarmUseCase';
import { ListFarmsUseCase } from '../application/listFarmsUseCase';
import { UpdateFarmUseCase } from '../application/updateFarmUseCase';
import {
  CreateFarmRequestDto,
  type FarmResponseDto,
  UpdateFarmRequestDto,
} from './dtos';

@Controller('farms')
export class FarmsController {
  constructor(
    private readonly createFarmUseCase: CreateFarmUseCase,
    private readonly deleteFarmUseCase: DeleteFarmUseCase,
    private readonly getFarmUseCase: GetFarmUseCase,
    private readonly listFarmsUseCase: ListFarmsUseCase,
    private readonly updateFarmUseCase: UpdateFarmUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateFarmRequestDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FarmResponseDto> {
    const farm = await this.createFarmUseCase.execute({
      name: dto.name,
      userId: user.id,
    });

    return this.toResponse(farm);
  }

  @Get()
  async list(@CurrentUser() user: AuthUser): Promise<FarmResponseDto[]> {
    const farms = await this.listFarmsUseCase.execute(user.id);

    return farms.map((farm) => this.toResponse(farm));
  }

  @Get(':id')
  async get(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ): Promise<FarmResponseDto> {
    const farm = await this.getFarmUseCase.execute({ id, userId: user.id });

    return this.toResponse(farm);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFarmRequestDto,
    @CurrentUser() user: AuthUser,
  ): Promise<FarmResponseDto> {
    const farm = await this.updateFarmUseCase.execute({
      id,
      name: dto.name,
      userId: user.id,
    });

    return this.toResponse(farm);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ): Promise<void> {
    await this.deleteFarmUseCase.execute({ id, userId: user.id });
  }

  private toResponse(farm: Farm): FarmResponseDto {
    return {
      id: farm.id,
      name: farm.name,
      userId: farm.userId,
      createdAt: farm.createdAt.toISOString(),
      updatedAt: farm.updatedAt.toISOString(),
    };
  }
}
