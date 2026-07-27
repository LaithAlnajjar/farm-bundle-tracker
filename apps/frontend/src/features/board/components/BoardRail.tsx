import type { ReactNode } from "react";
import { ItemSprite, PixelIcon, UserBadge } from "@/shared/components/farm-ui";
import { formatRelativeTime } from "@/shared/lib/formatDate";
import { cn } from "@/shared/lib/utils";
import type { BoardActivityEntry } from "../lib/boardActivity";
import { categoryIcon } from "../lib/boardIcons";
import type { NextReward } from "../lib/boardSelectors";
import type { BoardItem } from "../types/board.types";

export function BoardRail({
  activity,
  myClaims,
  nextReward,
  leavingSoon,
  currentUser,
  onGoToClaim,
}: {
  activity: BoardActivityEntry[];
  myClaims: BoardItem[];
  nextReward: NextReward | null;
  leavingSoon: BoardItem[];
  currentUser?: { id: number; username: string };
  onGoToClaim: (item: BoardItem) => void;
}) {
  return (
    <div className="flex flex-col gap-3.5">
      <ActivityCard entries={activity} />
      <ClaimsCard
        claims={myClaims}
        currentUser={currentUser}
        onGoToClaim={onGoToClaim}
      />
      {nextReward ? <NextRewardCard reward={nextReward} /> : null}
      {leavingSoon.length > 0 ? <LeavingSoonCard items={leavingSoon} /> : null}
    </div>
  );
}

function RailCard({
  header,
  children,
  className,
}: {
  header: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-md border-3 border-bark bg-paper shadow-drop-4",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b-2 border-dashed border-bark/25 px-3.5 py-2">
        {header}
      </div>
      <div className="px-3.5 py-2.5">{children}</div>
    </section>
  );
}

function RailLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-micro text-[10px] tracking-[1.4px] text-soil uppercase">
      {children}
    </span>
  );
}

function ActivityCard({ entries }: { entries: BoardActivityEntry[] }) {
  return (
    <RailCard
      header={
        <>
          <RailLabel>Board activity</RailLabel>
          <span
            aria-hidden
            className="size-2.25 animate-ping-dot rounded-[1px] border-2 border-ink bg-leaf-bright"
          />
        </>
      }
    >
      {entries.length === 0 ? (
        <p className="font-body text-lg text-soil">
          Nothing has happened here yet. Collect or claim an item to start the
          log.
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {entries.map((entry) => (
            <li className="flex items-start gap-2.5" key={entry.id}>
              <UserBadge
                className="mt-0.5"
                size="sm"
                userId={entry.userId}
                username={entry.username}
              />
              <div className="min-w-0">
                <p className="font-body text-lg leading-tight text-ink">
                  {entry.text}
                </p>
                <p className="truncate font-body text-[15px] text-sand">
                  {entry.context} · {formatRelativeTime(entry.at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </RailCard>
  );
}

function ClaimsCard({
  claims,
  currentUser,
  onGoToClaim,
}: {
  claims: BoardItem[];
  currentUser?: { id: number; username: string };
  onGoToClaim: (item: BoardItem) => void;
}) {
  return (
    <RailCard
      className="bg-parchment"
      header={
        <>
          {currentUser ? (
            <UserBadge
              size="sm"
              userId={currentUser.id}
              username={currentUser.username}
            />
          ) : null}
          <RailLabel>Your claims</RailLabel>
          <span className="ml-auto font-body text-[17px] text-ink-soft">
            {claims.length}
          </span>
        </>
      }
    >
      {claims.length === 0 ? (
        <p className="font-body text-lg text-soil">
          Nothing claimed yet — hit “I’ll get this” on a slot to put your name
          on it.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.75">
          {claims.map((item) => (
            <li key={item.slot.id}>
              <button
                className="flex w-full items-center gap-2.5 rounded-[3px] border-2 border-sand bg-paper px-2.25 py-1.25 text-left hover:border-bark focus-visible:ring-3 focus-visible:ring-gold focus-visible:outline-none"
                onClick={() => onGoToClaim(item)}
                type="button"
              >
                <ItemSprite
                  className="flex-none"
                  fallback={categoryIcon(item.slot.item.category)}
                  size={16}
                  slug={item.slot.item.slug}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-body text-[19px] leading-tight text-ink">
                    {item.slot.item.name}
                  </span>
                  <span className="block truncate font-body text-[15px] text-soil">
                    {item.room.name} · {item.bundle.name}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </RailCard>
  );
}

function NextRewardCard({ reward }: { reward: NextReward }) {
  return (
    <section className="rounded-md border-3 border-bark bg-gold px-4 py-3.5 shadow-drop-gold-4">
      <p className="mb-1.75 font-micro text-[10px] tracking-[1.4px] text-gold-ink uppercase">
        Next reward
      </p>
      <div className="flex items-center gap-3">
        <PixelIcon className="flex-none" name="star" size={34} />
        <div className="min-w-0">
          <p className="font-display text-[21px] leading-tight font-bold text-ink">
            {reward.bundle.completionReward}
          </p>
          <p className="font-body text-[17px] text-gold-ink">
            {reward.slotsLeft === 0
              ? `Unlocked — stamp ${reward.bundle.name}`
              : `${reward.slotsLeft} slot${reward.slotsLeft > 1 ? "s" : ""} left in ${reward.bundle.name}`}
          </p>
        </div>
      </div>
    </section>
  );
}

function LeavingSoonCard({ items }: { items: BoardItem[] }) {
  return (
    <section className="rounded-md border-3 border-ink bg-bark px-4 py-3.5 shadow-drop-4">
      <p className="mb-2 font-micro text-[10px] tracking-[1.4px] text-linen-dim uppercase">
        Leaving with the season
      </p>
      <ul className="flex flex-col gap-1.75">
        {items.map((item) => (
          <li className="flex items-center gap-2.5" key={item.slot.id}>
            <ItemSprite
              className="flex-none"
              fallback={categoryIcon(item.slot.item.category)}
              size={16}
              slug={item.slot.item.slug}
            />
            <span className="min-w-0 flex-1 truncate font-body text-[19px] text-linen">
              {item.slot.item.name}
            </span>
            <span className="flex-none font-body text-base text-gold">
              {item.room.name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
