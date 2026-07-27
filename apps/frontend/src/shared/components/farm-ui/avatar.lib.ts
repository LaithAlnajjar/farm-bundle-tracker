import type { AvatarName } from './farmUi.types';

/** Portrait -> display name, for alt text and captions. */
export const AVATAR_LABELS: Record<AvatarName, string> = {
  abigail: 'Abigail',
  alex: 'Alex',
  elliott: 'Elliott',
  emily: 'Emily',
  haley: 'Haley',
  harvey: 'Harvey',
  leah: 'Leah',
  maru: 'Maru',
  penny: 'Penny',
  sam: 'Sam',
  sebastian: 'Sebastian',
  shane: 'Shane',
};

/** Every portrait we can hand out, in a stable order for deterministic picks. */
export const AVATAR_NAMES = Object.keys(AVATAR_LABELS) as AvatarName[];

/** Pick a portrait for an account, so the same user always looks the same. */
export function avatarForUser(userId: number): AvatarName {
  return AVATAR_NAMES[Math.abs(userId) % AVATAR_NAMES.length] as AvatarName;
}
