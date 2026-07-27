import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATALOG_REPOSITORY } from '../catalogs.tokens';
import type { Catalog } from '../domain/catalog';
import type { CatalogRepository } from '../domain/catalog.repository';

@Injectable()
export class GetActiveCatalogUseCase {
  constructor(
    @Inject(CATALOG_REPOSITORY)
    private readonly catalogRepository: CatalogRepository,
  ) {}

  async execute(): Promise<Catalog> {
    const catalog = await this.catalogRepository.getActive();
    if (!catalog) throw new NotFoundException('Active catalog not found');
    return catalog;
  }
}
