import type { IconName } from "@/shared/components/farm-ui";
import type { CatalogCategory } from "../types/board.types";

/** Pixel sprite standing in for each catalog category on a ledger row. */
const categoryIcons: Record<CatalogCategory, IconName> = {
  crops: "parsnip",
  forage: "mushroom",
  fish: "fish",
  artisan_goods: "jar",
  animal_products: "egg",
  minerals_gems: "gem",
  monster_loot: "star",
  cooking_items: "pot",
  tree_products: "logs",
  specialty_items: "sprout",
  currency: "coin",
};

/** Sprite for each community-center room, keyed by catalog slug. */
const roomIcons: Record<string, IconName> = {
  "crafts-room": "mushroom",
  pantry: "parsnip",
  "fish-tank": "fish",
  "boiler-room": "gem",
  "bulletin-board": "egg",
  vault: "coin",
};

export function categoryIcon(category: CatalogCategory): IconName {
  return categoryIcons[category] ?? "star";
}

/** Falls back to a generic sprite so a custom catalog still renders. */
export function roomIcon(slug: string): IconName {
  return roomIcons[slug] ?? "pin";
}
