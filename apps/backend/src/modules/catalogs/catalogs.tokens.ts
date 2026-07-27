import type { InjectionToken } from '@nestjs/common';
import type { CatalogRepository } from './domain/catalog.repository';

export const CATALOG_REPOSITORY: InjectionToken<CatalogRepository> =
  Symbol('CATALOG_REPOSITORY');
