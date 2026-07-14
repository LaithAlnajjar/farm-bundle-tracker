import type {
  AvatarName,
  BundleItem,
  IconName,
  Season,
} from '@/shared/components/farm-ui';

export interface NavLink {
  label: string;
  href: string;
}

/** Icon-box framing for a "how it works" step card. */
export type StepFrame = 'bark' | 'harvest' | 'leaf' | 'gold';

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
  icon: IconName;
  frame: StepFrame;
  /** Farmhand avatar pinned to the icon box (the "claim" step). */
  claimedBy?: AvatarName;
}

/** Icon-box framing for a feature card sprite. */
export type FeatureFrame = 'harvest' | 'leaf' | 'fall' | 'soil' | 'winter';

export type FeatureIcon =
  | { kind: 'live' }
  | { kind: 'avatar'; avatar: AvatarName }
  | { kind: 'sprite'; icon: IconName; frame: FeatureFrame };

export interface FeatureCard {
  icon: FeatureIcon;
  title: string;
  description: string;
}

/** A bundle item on the showcase board; `live` pulses gold as "just changed". */
export interface ShowcaseItem extends BundleItem {
  live?: boolean;
}

/** Status chip in a showcase bundle card's header. */
export type BundleChip =
  | { kind: 'season'; season: Season; suffix?: string }
  | { kind: 'complete' }
  | { kind: 'note'; text: string };

export interface RewardNote {
  icon: IconName;
  label: string;
}

export interface ShowcaseBundle {
  name: string;
  chip: BundleChip;
  /** Card border treatment: in-season, completed-gold, or resting. */
  frame: 'fall' | 'gold' | 'sand';
  items: ShowcaseItem[];
  /** Extra slots not shown, rendered as a "+N" placeholder. */
  overflow?: number;
  slotSize?: 'sm' | 'md';
  /** Segment progress; omitted when the bundle is complete. */
  progress?: { value: number; max: number };
  footerNote: string;
  reward: RewardNote;
}

export interface SeasonPanel {
  season: Exclude<Season, 'any'>;
  icon: IconName;
  title: string;
  description: string;
}
