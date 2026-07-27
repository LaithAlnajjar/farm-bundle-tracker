import type { Catalog } from './catalog';

export interface CatalogRepository {
  getActive(): Promise<Catalog | null>;
}
