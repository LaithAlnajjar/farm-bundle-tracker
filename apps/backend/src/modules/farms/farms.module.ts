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

@Module({
  imports: [DrizzleModule],
  providers: [
    { provide: FARM_REPOSITORY, useClass: DrizzleFarmRepository },
    CreateFarmUseCase,
    DeleteFarmUseCase,
    GetFarmUseCase,
    ListFarmsUseCase,
    UpdateFarmUseCase,
  ],
  controllers: [FarmsController],
  exports: [],
})
export class FarmsModule {}
