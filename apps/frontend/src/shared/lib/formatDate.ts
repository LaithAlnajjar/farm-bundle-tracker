const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
});

const relativeFormatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
  style: "long",
});

/** Largest unit first — the first one that fits wins. */
const relativeUnits: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

export function formatDate(value: string | Date): string {
  return dateFormatter.format(
    typeof value === "string" ? new Date(value) : value,
  );
}

/**
 * "just now", "6 minutes ago", "yesterday" — anything older than a week falls
 * back to a plain date, where a relative phrase stops being useful.
 */
export function formatRelativeTime(
  value: string | Date,
  now: number = Date.now(),
): string {
  const at = typeof value === "string" ? Date.parse(value) : value.getTime();
  if (Number.isNaN(at)) return "";

  const elapsed = now - at;
  if (elapsed < 60_000) return "just now";
  if (elapsed > 7 * 86_400_000) return formatDate(new Date(at));

  for (const [unit, ms] of relativeUnits) {
    if (elapsed >= ms) {
      return relativeFormatter.format(-Math.floor(elapsed / ms), unit);
    }
  }
  return "just now";
}
