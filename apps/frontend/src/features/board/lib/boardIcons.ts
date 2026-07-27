import type { BundleTone, IconName } from "@/shared/components/farm-ui";
import type { CatalogCategory } from "../types/board.types";

/** Fallback sprite per catalog category, used when an item has no artwork. */
const categoryIcons: Record<CatalogCategory, IconName> = {
  crops: "parsnip",
  forage: "mushroom",
  fish: "fish",
  artisan_goods: "jar",
  animal_products: "egg",
  minerals_gems: "gem",
  monster_loot: "star",
  cooking_items: "soup",
  tree_products: "logs",
  specialty_items: "sprout",
  currency: "coin",
};

/** Junimo Note pouch colour for each community-center room. */
const roomTones: Record<string, BundleTone> = {
  "crafts-room": "purple",
  pantry: "green",
  "fish-tank": "teal",
  "boiler-room": "red",
  "bulletin-board": "yellow",
  vault: "blue",
};

export function categoryIcon(category: CatalogCategory): IconName {
  return categoryIcons[category] ?? "star";
}

/** Falls back to a spare pouch colour so a custom catalog still renders. */
export function roomTone(slug: string): BundleTone {
  return roomTones[slug] ?? "orange";
}
