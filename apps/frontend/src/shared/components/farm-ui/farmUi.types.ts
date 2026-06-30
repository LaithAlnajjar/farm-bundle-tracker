/** Decorative hue used for note headers, feature cards and panels. */
export type Tone = 'spring' | 'summer' | 'fall' | 'winter' | 'ore' | 'primary';

/** Subset of {@link Tone} that has a matching striped progress-bar fill. */
export type ProgressTone = 'spring' | 'winter' | 'ore' | 'primary';

/** Push-pin colors available for pinned note cards. */
export type PinColor = 'red' | 'blue' | 'amber' | 'green';

/** Stardew season a bundle item belongs to. */
export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'any';

/** A single collectible item shown inside a bundle. */
export interface BundleItem {
  emoji: string;
  /** Human label shown under the slot (omitted in compact previews). */
  label?: string;
  done: boolean;
  /** Initial of the farmhand who claimed this item, if any. */
  assigned?: string;
}
