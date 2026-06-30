import type { PinColor, ProgressTone, Season, Tone } from './farmUi.types';

/** Tone -> colored note/card header background. */
export const toneHeaderBg: Record<Tone, string> = {
  spring: 'bg-spring',
  summer: 'bg-summer',
  fall: 'bg-fall',
  winter: 'bg-winter',
  ore: 'bg-ore',
  primary: 'bg-primary',
};

/** Tone -> striped fill applied to the shadcn Progress indicator. */
export const barFillByTone: Record<ProgressTone, string> = {
  spring: '[&>[data-slot=progress-indicator]]:bar-spring',
  winter: '[&>[data-slot=progress-indicator]]:bar-winter',
  ore: '[&>[data-slot=progress-indicator]]:bar-ore',
  primary: '[&>[data-slot=progress-indicator]]:bar-primary',
};

/** Tone -> matching text color (used for the percent readout). */
export const toneText: Record<ProgressTone, string> = {
  spring: 'text-spring',
  winter: 'text-winter',
  ore: 'text-ore',
  primary: 'text-primary',
};

/** Push-pin color -> background. */
export const pinBg: Record<PinColor, string> = {
  red: 'bg-destructive',
  blue: 'bg-winter',
  amber: 'bg-amber',
  green: 'bg-primary',
};

/** Season -> badge background + label. */
export const seasonTag: Record<Season, { className: string; label: string }> = {
  spring: { className: 'bg-spring', label: '🌱 Spring' },
  summer: { className: 'bg-summer', label: '☀️ Summer' },
  fall: { className: 'bg-fall', label: '🍂 Fall' },
  winter: { className: 'bg-winter', label: '❄️ Winter' },
  any: { className: 'bg-wood', label: '📅 Any' },
};
