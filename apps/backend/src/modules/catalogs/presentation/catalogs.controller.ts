import { Controller, Get } from '@nestjs/common';
import { GetActiveCatalogUseCase } from '../application/getActiveCatalogUseCase';
import type {
  Catalog,
  CatalogBundle,
  CatalogRoom,
  CatalogSlot,
} from '../domain/catalog';
import type {
  CatalogBundleResponseDto,
  CatalogResponseDto,
  CatalogRoomResponseDto,
  CatalogSlotResponseDto,
} from './dtos';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly getActiveCatalog: GetActiveCatalogUseCase) {}

  @Get('active')
  async getActive(): Promise<CatalogResponseDto> {
    const catalog = await this.getActiveCatalog.execute();
    return this.toResponse(catalog);
  }

  private toResponse(catalog: Catalog): CatalogResponseDto {
    return {
      id: catalog.id,
      slug: catalog.slug,
      name: catalog.name,
      gameVersion: catalog.gameVersion,
      manifestRevision: catalog.manifestRevision,
      rooms: catalog.rooms.map((room) => this.toRoomResponse(room)),
    };
  }

  private toRoomResponse(room: CatalogRoom): CatalogRoomResponseDto {
    return {
      id: room.id,
      slug: room.slug,
      name: room.name,
      completionReward: room.completionReward,
      sortOrder: room.sortOrder,
      bundles: room.bundles.map((bundle) => this.toBundleResponse(bundle)),
    };
  }

  private toBundleResponse(bundle: CatalogBundle): CatalogBundleResponseDto {
    return {
      id: bundle.id,
      slug: bundle.slug,
      name: bundle.name,
      completionReward: bundle.completionReward,
      requiredSlots: bundle.requiredSlots,
      sortOrder: bundle.sortOrder,
      slots: bundle.slots.map((slot) => this.toSlotResponse(slot)),
    };
  }

  private toSlotResponse(slot: CatalogSlot): CatalogSlotResponseDto {
    return {
      id: slot.id,
      slug: slot.slug,
      sortOrder: slot.sortOrder,
      quantity: slot.quantity,
      minimumQuality: slot.minimumQuality,
      item: {
        id: slot.item.id,
        slug: slot.item.slug,
        name: slot.item.name,
        category: slot.item.category,
        availability: slot.item.availability,
      },
    };
  }
}
