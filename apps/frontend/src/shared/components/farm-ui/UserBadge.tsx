import { cn } from "@/shared/lib/utils";
import { userBadgeStyle, userInitials } from "./userBadge.lib";

export function UserBadge({
  userId,
  username,
  size = "md",
  className,
}: {
  userId: number;
  username: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border-2 font-display font-bold",
        userBadgeStyle(userId),
        size === "sm" && "size-7 text-xs",
        size === "md" && "size-9 text-sm",
        size === "lg" && "size-11 text-base",
        className,
      )}
      title={username}
    >
      {userInitials(username)}
    </span>
  );
}
