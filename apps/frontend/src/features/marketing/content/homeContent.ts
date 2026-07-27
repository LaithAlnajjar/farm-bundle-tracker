import type { AvatarName, IconName } from '@/shared/components/farm-ui';
import type {
  FeatureCard,
  HowItWorksStep,
  NavLink,
  SeasonPanel,
  ShowcaseBundle,
} from '@/features/marketing/types/home.types';

export const BRAND = {
  name: 'Bundle Board',
  tagline: 'Co-op farm tracker',
  footerTagline: 'Made with real pixels',
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: 'How it works', href: '#how' },
  { label: 'Features', href: '#features' },
  { label: 'The board', href: '#board' },
  { label: 'Seasons', href: '#seasons' },
];

export const HERO = {
  kicker: 'For co-op farms & completionist crews',
  title: 'Everything your farm needs, pinned to one board.',
  description:
    "The shared notice board where your whole crew pins what's needed, claims what they'll grab, and stamps it done together, season by season.",
  primaryCta: 'Start your board',
  secondaryCta: 'See a live board',
  onlineAvatars: ['abigail', 'sam', 'leah', 'sebastian'] satisfies AvatarName[],
  onlineNote: '5 farmhands on the board right now',
  rewardChip: 'Bridge repaired!',
} as const;

export const HERO_BUNDLE: ShowcaseBundle = {
  name: 'Fall Foraging',
  chip: { kind: 'season', season: 'fall', suffix: 'in season' },
  frame: 'fall',
  items: [
    {
      slug: 'common-mushroom',
      icon: 'mushroom',
      label: 'Common Mushroom',
      state: 'collected',
    },
    { slug: 'wild-plum', icon: 'mushroom', label: 'Wild Plum', state: 'collected' },
    {
      slug: 'hazelnut',
      icon: 'mushroom',
      label: 'Hazelnut',
      state: 'claimed',
      claimedBy: 'sebastian',
    },
    { slug: 'blackberry', icon: 'mushroom', label: 'Blackberry', state: 'needed' },
  ],
  progress: { value: 2, max: 4 },
  footerNote: '2 of 4',
  reward: { icon: 'sprout', label: '30 Fall Seeds' },
};

export const HERO_LIVE_NOTE = {
  avatar: 'sam' satisfies AvatarName,
  actor: 'Sam',
  action: 'caught the Walleye',
  meta: 'just now · live',
  icon: 'fish' satisfies IconName,
} as const;

export const TRUST_STRIP = {
  text: 'One board your whole crew shares on desktop and phone.',
  icons: [
    'parsnip',
    'fish',
    'mushroom',
    'egg',
    'gem',
    'star',
  ] satisfies IconName[],
} as const;

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    number: '01',
    title: "Pin what's needed",
    description:
      'Build rooms and bundles, or start from a template. Every item your farm still needs goes up on the board.',
    icon: 'pin',
    frame: 'bark',
  },
  {
    number: '02',
    title: 'Claim your runs',
    description:
      "Call dibs on an item so nobody double-grabs. Your face pins to it until it's turned in.",
    icon: 'fish',
    frame: 'harvest',
    claimedBy: 'sam',
  },
  {
    number: '03',
    title: 'Stamp it collected',
    description:
      'Two taps to mark an item done. A satisfying stamp lands it and other open boards refresh regularly.',
    icon: 'check',
    frame: 'leaf',
  },
  {
    number: '04',
    title: 'Finish the bundle',
    description:
      'Complete a bundle and the whole farm sees the stars. Rewards unlock, rooms fill in.',
    icon: 'star',
    frame: 'gold',
  },
];

export const FEATURES: FeatureCard[] = [
  {
    icon: { kind: 'live' },
    title: 'Shared and refresh-aware',
    description:
      'Your own changes land immediately; other open boards poll and refresh on focus until live sync arrives.',
  },
  {
    icon: { kind: 'avatar', avatar: 'penny' },
    title: "Claim, don't collide",
    description:
      "Dibs pin your avatar to an item so no one wastes a night catching a fish that's already handled.",
  },
  {
    icon: { kind: 'sprite', icon: 'check', frame: 'leaf' },
    title: 'Two-tap collect',
    description:
      'Big hit-targets, one-handed, right next to the keyboard. Stamp an item the moment it lands in your inventory.',
  },
  {
    icon: { kind: 'sprite', icon: 'pumpkin', frame: 'fall' },
    title: 'Season-aware',
    description:
      "Items light up when they're catchable, plantable or forageable — and dim when the season passes.",
  },
  {
    icon: { kind: 'sprite', icon: 'coin', frame: 'soil' },
    title: 'Rooms & rewards',
    description:
      'Organize bundles by room and see the reward each one unlocks — bridge repairs, quarry access, and more.',
  },
  {
    icon: { kind: 'sprite', icon: 'jar', frame: 'winter' },
    title: 'Online by design',
    description:
      'Writes stay server-authoritative and errors remain visible. Offline queues are deliberately outside v1.',
  },
];

export const BOARD_SHOWCASE = {
  farmName: 'Willow Creek Farm',
  farmMeta: 'Year 2 · Fall · Community Center 14/30',
  onlineAvatars: ['abigail', 'sam', 'leah', 'emily'] satisfies AvatarName[],
  filters: { active: 'All bundles', inSeason: 'In season', rest: 'Still needed' },
  filterSummary: '6 rooms · 30 bundles · 16 to go',
  room: {
    icon: 'fish' satisfies IconName,
    name: 'Fish Tank',
    progress: { value: 2, max: 6 },
    progressNote: '2 of 6 bundles',
    reward: 'Glittering Boulder removed',
  },
} as const;

export const SHOWCASE_BUNDLES: ShowcaseBundle[] = [
  {
    name: 'Night Fishing',
    chip: { kind: 'season', season: 'fall', suffix: 'now' },
    frame: 'fall',
    items: [
      {
        slug: 'walleye',
        icon: 'fish',
        label: 'Walleye',
        state: 'collected',
        live: true,
      },
      { slug: 'bream', icon: 'fish', label: 'Bream', state: 'needed' },
      {
        slug: 'eel',
        icon: 'fish',
        label: 'Eel',
        state: 'claimed',
        claimedBy: 'sam',
      },
    ],
    progress: { value: 1, max: 3 },
    footerNote: '1 of 3',
    reward: { icon: 'gem', label: 'Small Glow Ring' },
  },
  {
    name: 'River Fish',
    chip: { kind: 'complete' },
    frame: 'gold',
    items: [
      { slug: 'sunfish', icon: 'fish', label: 'Sunfish', state: 'golden' },
      { slug: 'catfish', icon: 'fish', label: 'Catfish', state: 'golden' },
      { slug: 'shad', icon: 'fish', label: 'Shad', state: 'golden' },
      { slug: 'tiger-trout', icon: 'fish', label: 'Tiger Trout', state: 'golden' },
    ],
    footerNote: '4 of 4 — turned in!',
    reward: { icon: 'jar', label: 'by Abigail' },
  },
  {
    name: 'Crab Pot',
    chip: { kind: 'note', text: 'Any 5 of 10' },
    frame: 'sand',
    items: [
      { slug: 'crayfish', icon: 'fish', label: 'Crayfish', state: 'collected' },
      { slug: 'mussel', icon: 'fish', label: 'Mussel', state: 'collected' },
      { slug: 'cockle', icon: 'fish', label: 'Cockle', state: 'needed' },
      { slug: 'clam', icon: 'fish', label: 'Clam', state: 'needed' },
    ],
    overflow: 6,
    slotSize: 'sm',
    progress: { value: 2, max: 5 },
    footerNote: '2 of 5',
    reward: { icon: 'soup', label: 'Crab Cakes' },
  },
];

export const SEASONS: SeasonPanel[] = [
  {
    season: 'spring',
    icon: 'daffodil',
    title: 'Spring',
    description:
      "Foraged blossoms, first fish, and the year's opening plantings.",
  },
  {
    season: 'summer',
    icon: 'sunflower',
    title: 'Summer',
    description:
      'Peak harvests and the long-daylight catches worth staying up for.',
  },
  {
    season: 'fall',
    icon: 'pumpkin',
    title: 'Fall',
    description:
      'Foraging season and the last window on a handful of tricky fish.',
  },
  {
    season: 'winter',
    icon: 'crocus',
    title: 'Winter',
    description:
      'Mining hauls, gems, and the rare cold-water fish to close things out.',
  },
];

export const QUOTE = {
  text: '"We cleared the Community Center two seasons faster once nobody was re-catching the same fish."',
  avatar: 'abigail' satisfies AvatarName,
  author: 'Abigail',
  farm: 'Willow Creek Farm',
  crews: ['Willow Creek', 'Pelican Co-op', 'Star Drop Guild', 'Ferngill Collective'],
} as const;

export const CTA = {
  kicker: 'Pin your first bundle in a minute',
  title: "Start your farm's board",
  description:
    'Free for your whole crew. No card, no setup — invite your farmhands and start stamping.',
  primaryCta: 'Start a board',
  secondaryCta: 'Browse templates',
} as const;

export const FOOTER = {
  legal:
    '© Year 2 · Bundle Board. A fan-made co-op tracker, not affiliated with any game.',
  motto: 'Pins never floating · shadows never blurred',
} as const;
