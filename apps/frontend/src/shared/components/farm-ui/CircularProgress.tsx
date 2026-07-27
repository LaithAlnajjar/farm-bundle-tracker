import { cn } from "@/shared/lib/utils";

export function CircularProgress({
  value,
  max,
  size = 84,
  className,
}: {
  value: number;
  max: number;
  size?: number;
  className?: string;
}) {
  const percentage = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div
      aria-label={`${percentage}% complete`}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={value}
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full border-3 border-bark bg-paper shadow-drop-3",
        className,
      )}
      role="progressbar"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(var(--season-accent) ${percentage}%, var(--color-oat) ${percentage}% 100%)`,
      }}
    >
      <span className="grid size-[72%] place-items-center rounded-full border-2 border-bark bg-paper font-display text-xl font-bold text-ink">
        {percentage}%
      </span>
    </div>
  );
}
