/** Season a bundle item belongs to. */
export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'any';

/** Pixel-sprite glyphs available under /assets/icon-*.png. */
export type IconName =
  | 'check'
  | 'coin'
  | 'egg'
  | 'fish'
  | 'gem'
  | 'jar'
  | 'logs'
  | 'mushroom'
  | 'parsnip'
  | 'pin'
  | 'pot'
  | 'pumpkin'
  | 'sprout'
  | 'star';

/** Pixel farmhand portraits available under /assets/ava-*.png. */
export type AvatarName = 'abby' | 'lena' | 'marcus' | 'pia' | 'sam' | 'theo';

/** Lifecycle of an item slot on the board. */
export type SlotState = 'needed' | 'claimed' | 'collected' | 'golden';

/** Fill hue for progress readouts. */
export type ProgressTone = 'leaf' | 'harvest';

/** A single collectible item shown inside a bundle. */
export interface BundleItem {
  icon: IconName;
  /** Item name, used for alt text and row labels. */
  label: string;
  state: SlotState;
  /** Farmhand whose avatar pins to the slot while claimed. */
  claimedBy?: AvatarName;
}
