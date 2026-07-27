/** Season a bundle item belongs to. */
export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'any';

/** Game sprites available under /assets/icons/*.png. */
export type IconName =
  | 'check'
  | 'coin'
  | 'crocus'
  | 'daffodil'
  | 'egg'
  | 'fish'
  | 'gem'
  | 'jar'
  | 'junimo'
  | 'logs'
  | 'mushroom'
  | 'parsnip'
  | 'pin'
  | 'pumpkin'
  | 'quality-gold'
  | 'quality-iridium'
  | 'quality-silver'
  | 'soup'
  | 'sprout'
  | 'star'
  | 'sunflower';

/** Villager portraits available under /assets/avatars/*.png. */
export type AvatarName =
  | 'abigail'
  | 'alex'
  | 'elliott'
  | 'emily'
  | 'haley'
  | 'harvey'
  | 'leah'
  | 'maru'
  | 'penny'
  | 'sam'
  | 'sebastian'
  | 'shane';

/** Bundle-pouch colours from the Junimo Note, one per community-center room. */
export type BundleTone =
  | 'blue'
  | 'green'
  | 'orange'
  | 'purple'
  | 'red'
  | 'teal'
  | 'yellow';

/** Lifecycle of an item slot on the board. */
export type SlotState = 'needed' | 'claimed' | 'collected' | 'golden';

/** Fill hue for progress readouts. */
export type ProgressTone = 'leaf' | 'harvest';

/** A single collectible item shown inside a bundle. */
export interface BundleItem {
  /** Catalog slug, resolved to its own sprite under /assets/items. */
  slug: string;
  /** Sprite used while the item's own slug has no artwork. */
  icon: IconName;
  /** Item name, used for alt text and row labels. */
  label: string;
  state: SlotState;
  /** Farmhand whose portrait pins to the slot while claimed. */
  claimedBy?: AvatarName;
}
