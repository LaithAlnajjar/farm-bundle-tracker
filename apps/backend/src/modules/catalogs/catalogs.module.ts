import { Module } from '@nestjs/common';
import { GetActiveCatalogUseCase } from './application/getActiveCatalogUseCase';
import { CATALOG_REPOSITORY } from './catalogs.tokens';
import { DrizzleCatalogRepository } from './infrastructure/repositories/catalog.repository';
import { CatalogsController } from './presentation/catalogs.controller';

@Module({
  providers: [
    { provide: CATALOG_REPOSITORY, useClass: DrizzleCatalogRepository },
    GetActiveCatalogUseCase,
  ],
  controllers: [CatalogsController],
  exports: [CATALOG_REPOSITORY],
})
export class CatalogsModule {}
