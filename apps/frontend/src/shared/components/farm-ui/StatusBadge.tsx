import { cn } from "@/shared/lib/utils";

const styles = {
  needed: "border-harvest bg-gold-soft text-gold-ink",
  claimed: "border-fall bg-fall-soft text-fall-ink",
  collected: "border-leaf bg-leaf-soft text-leaf-dark",
  optional: "border-sand bg-oat text-soil",
  complete: "border-gold-deep bg-gold text-ink",
  neutral: "border-soil bg-parchment text-soil",
} as const;

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof styles;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-full border-2 px-2.5 font-micro text-[9px] tracking-[0.08em] uppercase",
        styles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
