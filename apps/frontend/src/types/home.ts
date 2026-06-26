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

/** Compact bundle teaser pinned to the hero notice board. */
export interface BundlePreview {
  id: string;
  headerLabel: string;
  tone: ProgressTone;
  pin: PinColor;
  /** Rotation in degrees for the pinned-paper look. */
  rotate: number;
  items: BundleItem[];
}

/** Full bundle card rendered on the bundle board. */
export interface Bundle {
  id: string;
  headerLabel: string;
  season: Season;
  tone: ProgressTone;
  pin: PinColor;
  rotate: number;
  /** Number of slot columns in the item grid. */
  columns: number;
  items: BundleItem[];
}

/** "How it works" feature card. */
export interface Feature {
  id: string;
  icon: string;
  title: string;
  tone: Tone;
  body: string;
  note: string;
}

/** One side of the Solo-vs-Co-op comparison. */
export interface FarmModePanel {
  mode: FarmMode;
  icon: string;
  title: string;
  tone: Extract<Tone, 'primary' | 'winter'>;
  body: string;
  bullets: string[];
}

export type FarmMode = 'solo' | 'shared';

export interface QuickFact {
  icon: string;
  stat: string;
  note: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface LegendEntry {
  glyph: string;
  label: string;
  /** Render the swatch as a circular assignee badge. */
  badge?: boolean;
  swatchClassName: string;
}
