import { cn } from "@/shared/lib/utils";
import { userBadgeStyle, userInitials } from "./userBadge.lib";

const sizes = {
  sm: "size-6 text-[11px]",
  md: "size-8 text-sm",
  lg: "size-10 text-lg",
} as const;

/**
 * A real farmhand's stand-in portrait: initials in a framed pixel tile that
 * matches the sprite avatars used elsewhere on the board.
 */
export function UserBadge({
  userId,
  username,
  size = "md",
  className,
}: {
  userId: number;
  username: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[3px] border-2 border-bark font-display leading-none font-bold",
        userBadgeStyle(userId),
        sizes[size],
        className,
      )}
      title={username}
    >
      {userInitials(username)}
    </span>
  );
}
