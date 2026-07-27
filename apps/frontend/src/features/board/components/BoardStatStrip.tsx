import type { ReactNode } from "react";
import type { FarmSeason } from "@/features/farms/types/farm.types";
import {
  PixelIcon,
  seasonSurface,
  UserBadge,
} from "@/shared/components/farm-ui";
import { cn } from "@/shared/lib/utils";
import type { BoardSummary } from "../lib/boardSelectors";

const seasonIcon = {
  spring: "sprout",
  summer: "jar",
  fall: "pumpkin",
  winter: "gem",
} as const;

function StatCard({
  icon,
  value,
  suffix,
  label,
  className,
}: {
  icon: ReactNode;
  value: ReactNode;
  suffix?: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-md border-3 border-bark bg-paper px-3.5 py-3 shadow-drop-4",
        className,
      )}
    >
      <span className="flex-none">{icon}</span>
      <div className="min-w-0">
        <p className="font-display text-[27px] leading-none font-bold text-ink">
          {value}
          {suffix ? (
            <span className="font-body text-[19px] text-soil"> {suffix}</span>
          ) : null}
        </p>
        <p className="mt-1 font-micro text-[9px] tracking-[1.2px] text-soil uppercase">
          {label}
        </p>
      </div>
    </div>
  );
}

export function BoardStatStrip({
  summary,
  season,
  currentUser,
}: {
  summary: BoardSummary;
  season: FarmSeason;
  currentUser?: { id: number; username: string };
}) {
  return (
    <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<PixelIcon name="check" size={28} />}
        label="Bundles stamped"
        suffix={`/ ${summary.bundlesTotal}`}
        value={summary.bundlesStamped}
      />
      <StatCard
        icon={<PixelIcon name="pin" size={28} />}
        label="Items still needed"
        value={summary.neededCount}
      />
      <StatCard
        icon={
          currentUser ? (
            <UserBadge
              size="md"
              userId={currentUser.id}
              username={currentUser.username}
            />
          ) : (
            <PixelIcon name="star" size={28} />
          )
        }
        label="Your claims"
        value={summary.myClaims.length}
      />
      <StatCard
        className={cn("border-3", seasonSurface[season])}
        icon={<PixelIcon name={seasonIcon[season]} size={28} />}
        label={`Available in ${season}`}
        value={summary.inSeasonCount}
      />
    </div>
  );
}
