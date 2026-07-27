import { cn } from "@/shared/lib/utils";
import { avatarForUser } from "./avatar.lib";
import { PixelAvatar } from "./PixelAvatar";

const sizes = { sm: 24, md: 32, lg: 40 } as const;

/**
 * A farmhand's portrait on the board. Each account is dealt a villager from
 * the town, keyed off its id so the same person always wears the same face.
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
    <PixelAvatar
      alt={username}
      className={cn("border-2", className)}
      name={avatarForUser(userId)}
      size={sizes[size]}
      title={username}
    />
  );
}
