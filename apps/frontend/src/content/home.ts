import type {
  Bundle,
  BundlePreview,
  Feature,
  FarmModePanel,
  LegendEntry,
  NavLink,
  QuickFact,
} from '@/types/home';

export const BRAND = {
  name: 'Valley Bundles',
  emoji: '🌾',
  tagline: 'A fan-made companion tool',
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: 'Bundles', href: '#bundles' },
  { label: 'Seasons', href: '#seasons' },
  { label: 'My Farm', href: '#farm' },
  { label: 'Guide', href: '#guide' },
];

export const FOOTER_LINKS: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Bundle Guide', href: '#guide' },
  { label: 'Seasons', href: '#seasons' },
  { label: 'Privacy', href: '#privacy' },
];

export const HERO_QUICK_FACTS: QuickFact[] = [
  { icon: '🏛️', stat: '6 Rooms', note: 'to restore' },
  { icon: '📦', stat: '30 Bundles', note: 'to complete' },
  { icon: '🤝', stat: '1–4 Players', note: 'per farm' },
];

/** Compact teasers pinned to the hero notice board. */
export const HERO_BUNDLE_PREVIEWS: BundlePreview[] = [
  {
    id: 'spring-crops',
    headerLabel: '🌱 Spring Crops',
    tone: 'spring',
    pin: 'red',
    rotate: -2.2,
    items: [
      { emoji: '🥬', done: true },
      { emoji: '🫘', done: true },
      { emoji: '🥦', done: false },
      { emoji: '🥔', done: false },
    ],
  },
  {
    id: 'lake-fish',
    headerLabel: '🐟 Lake Fish',
    tone: 'winter',
    pin: 'blue',
    rotate: 1.8,
    items: [
      { emoji: '🐡', done: true },
      { emoji: '🎣', done: true },
      { emoji: '🐠', done: true },
      { emoji: '🐟', done: false },
    ],
  },
];

export const HERO_BOILER_PREVIEW: BundlePreview = {
  id: 'boiler-room',
  headerLabel: '⚙️ Boiler Room',
  tone: 'ore',
  pin: 'amber',
  rotate: -1,
  items: [
    { emoji: '🪨', done: true },
    { emoji: '🔥', done: true },
    { emoji: '💎', done: false },
    { emoji: '🔩', done: false },
    { emoji: '🥇', done: false },
  ],
};

export const FEATURES: Feature[] = [
  {
    id: 'track',
    icon: '📋',
    title: 'Track Bundles',
    tone: 'primary',
    body: "Mark items as collected, missing, or claimed by a specific farmhand. See each room's completion at a glance.",
    note: 'Pantry · Crafts Room · Fish Tank · Vault · Bulletin Board · Boiler Room',
  },
  {
    id: 'friends',
    icon: '👥',
    title: 'Play With Friends',
    tone: 'winter',
    body: 'Share a farm link and collaborate in real time. Assign items to farmhands so no one brings duplicates.',
    note: 'Up to 4 players per shared farm',
  },
  {
    id: 'seasons',
    icon: '📅',
    title: 'Plan Each Season',
    tone: 'fall',
    body: 'Know exactly which crops, fish, and forageables are available right now. Never miss a time-sensitive bundle item again.',
    note: 'Spring · Summer · Fall · Winter',
  },
];

export const CRAFTS_ROOM_BUNDLES: Bundle[] = [
  {
    id: 'spring-crops-bundle',
    headerLabel: '🌱 Spring Crops Bundle',
    season: 'spring',
    tone: 'spring',
    pin: 'red',
    rotate: -1.2,
    columns: 4,
    items: [
      { emoji: '🥬', label: 'Parsnip', done: true },
      { emoji: '🫘', label: 'Gr. Bean', done: true },
      { emoji: '🥦', label: 'Cauliflower', done: false, assigned: 'J' },
      { emoji: '🥔', label: 'Potato', done: false },
    ],
  },
  {
    id: 'lake-fish-bundle',
    headerLabel: '🐟 Lake Fish Bundle',
    season: 'any',
    tone: 'winter',
    pin: 'blue',
    rotate: 0.6,
    columns: 4,
    items: [
      { emoji: '🐡', label: 'Catfish', done: true },
      { emoji: '🎣', label: 'Shad', done: true },
      { emoji: '🐠', label: 'Bullhead', done: true },
      { emoji: '🐟', label: 'Carp', done: false },
    ],
  },
  {
    id: 'boiler-room-bundle',
    headerLabel: '⚙️ Boiler Room Bundle',
    season: 'any',
    tone: 'ore',
    pin: 'amber',
    rotate: -0.7,
    columns: 3,
    items: [
      { emoji: '🪨', label: 'Quartz', done: true },
      { emoji: '🔥', label: 'Coal', done: true },
      { emoji: '💎', label: 'Diamond', done: false },
      { emoji: '🔩', label: 'Iron Bar', done: false, assigned: 'M' },
      { emoji: '🥇', label: 'Gold Bar', done: false },
      { emoji: '🌑', label: 'E. Crystal', done: false },
    ],
  },
];

export const BUNDLE_LEGEND: LegendEntry[] = [
  {
    glyph: '✔',
    label: 'Collected',
    swatchClassName: 'bg-slot-done border-primary text-primary',
  },
  {
    glyph: '…',
    label: 'Not yet',
    swatchClassName: 'bg-slot border-wood/45 text-primary',
  },
  {
    glyph: 'J',
    label: 'Assigned',
    badge: true,
    swatchClassName: 'bg-winter border-winter text-parchment',
  },
];

export const FARM_MODE_PANELS: FarmModePanel[] = [
  {
    mode: 'solo',
    icon: '🏠',
    title: 'Solo Farm',
    tone: 'primary',
    body: 'Play at your own pace. Track your personal progress through all six Community Center rooms and plan ahead for each new season without any coordination overhead.',
    bullets: [
      'Personal bundle board, synced across devices',
      'Season planner shows what to gather now',
      'In-game reminder notes for each bundle',
      'Pick up where you left off, any time',
    ],
  },
  {
    mode: 'shared',
    icon: '🤝',
    title: 'Shared Farm',
    tone: 'winter',
    body: 'Invite your whole crew. Everyone sees the same board and can mark items collected or claim them for themselves — no more doubled effort or missed bundles.',
    bullets: [
      'Shared board visible to all farmhands',
      'Claim items so no one doubles up',
      'See who checked off what',
      'Invite via a shareable farm link',
    ],
  },
];

export const CTA_CROPS: string[] = ['🌱', '🌾', '🥕', '🍓', '🌻', '🍂', '🧊', '🌱'];
