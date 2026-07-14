import { cva } from 'class-variance-authority';
import type { AvatarName, Season } from './farmUi.types';

/** Pixel-art chunky button: hard offset shadow that compresses on press. */
export const chunkyButtonVariants = cva(
  'inline-flex cursor-pointer select-none items-center justify-center gap-2 rounded-sm border-3 border-bark px-5 py-2.5 font-display text-xl font-bold leading-none transition-[transform,box-shadow] hover:translate-y-0.5 active:translate-y-1 disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-sand-strong disabled:bg-oat disabled:text-oat-ink disabled:shadow-none',
  {
    variants: {
      variant: {
        primary:
          'bg-harvest text-paper shadow-drop-5 hover:shadow-drop-3 active:shadow-drop-2',
        secondary:
          'bg-paper text-bark shadow-drop-4 hover:shadow-drop-2 active:shadow-drop-2',
        danger:
          'bg-berry text-paper shadow-drop-5 hover:shadow-drop-3 active:shadow-drop-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

/** Season -> tag colors (soft fill, hard border, matching ink + dot). */
export const seasonTag: Record<
  Season,
  { chip: string; dot: string; label: string }
> = {
  spring: {
    chip: 'bg-spring-soft border-spring text-spring-ink',
    dot: 'bg-spring',
    label: 'Spring',
  },
  summer: {
    chip: 'bg-summer-soft border-summer text-summer-ink',
    dot: 'bg-summer',
    label: 'Summer',
  },
  fall: {
    chip: 'bg-fall-soft border-fall text-fall-ink',
    dot: 'bg-fall',
    label: 'Fall',
  },
  winter: {
    chip: 'bg-winter-soft border-winter text-winter-ink',
    dot: 'bg-winter',
    label: 'Winter',
  },
  any: {
    chip: 'bg-parchment border-soil text-ink-soft',
    dot: 'bg-soil',
    label: 'Any season',
  },
};

/** Season -> panel colors for the season showcase cards. */
export const seasonPanel: Record<
  Exclude<Season, 'any'>,
  { panel: string; title: string; body: string }
> = {
  spring: {
    panel: 'bg-spring-soft border-spring',
    title: 'text-spring-ink',
    body: 'text-leaf-deep',
  },
  summer: {
    panel: 'bg-summer-soft border-summer',
    title: 'text-summer-ink',
    body: 'text-summer-ink',
  },
  fall: {
    panel: 'bg-fall-soft border-fall',
    title: 'text-fall-ink',
    body: 'text-berry-dark',
  },
  winter: {
    panel: 'bg-winter-soft border-winter',
    title: 'text-winter-ink',
    body: 'text-winter-ink',
  },
};

/** Avatar -> sprite backdrop, so portraits stay readable on any surface. */
export const avatarBg: Record<AvatarName, string> = {
  abby: 'bg-ava-abby',
  lena: 'bg-ava-lena',
  marcus: 'bg-ava-marcus',
  pia: 'bg-ava-pia',
  sam: 'bg-ava-sam',
  theo: 'bg-ava-theo',
};
