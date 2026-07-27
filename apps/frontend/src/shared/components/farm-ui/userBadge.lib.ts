const badgeStyles = [
  "border-leaf-dark bg-leaf-soft text-leaf-dark",
  "border-summer-ink bg-summer-soft text-summer-ink",
  "border-fall-ink bg-fall-soft text-fall-ink",
  "border-winter-ink bg-winter-soft text-winter-ink",
  "border-gold-ink bg-gold-soft text-gold-ink",
  "border-soil bg-parchment text-soil",
] as const;

export function userInitials(username: string) {
  const parts = username.trim().split(/[\s_-]+/).filter(Boolean);
  if (parts.length > 1) {
    return `${parts[0]?.[0] ?? ""}${parts.at(-1)?.[0] ?? ""}`.toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}

export function userBadgeStyle(userId: number) {
  return badgeStyles[Math.abs(userId) % badgeStyles.length];
}
