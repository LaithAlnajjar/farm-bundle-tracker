import { PixelIcon } from "@/shared/components/farm-ui";
import { cn } from "@/shared/lib/utils";
import { roomIcon } from "../lib/boardIcons";
import type { BoardFilter, BoardRoom } from "../types/board.types";

const filters: { id: BoardFilter; label: string }[] = [
  { id: "all", label: "All slots" },
  { id: "needed", label: "Still needed" },
  { id: "mine", label: "Mine" },
  { id: "season", label: "In season" },
];

export function BoardRoomHeader({
  room,
  filter,
  onFilterChange,
}: {
  room: BoardRoom;
  filter: BoardFilter;
  onFilterChange: (filter: BoardFilter) => void;
}) {
  const { completed, total } = room.progress;

  return (
    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2.5 pt-0.5">
      <PixelIcon className="flex-none" name={roomIcon(room.slug)} size={38} />
      <h1 className="font-display text-[32px] leading-none font-bold text-ink">
        {room.name}
      </h1>
      <p className="font-body text-xl text-ink-soft">
        {completed} of {total} bundles stamped
      </p>

      <div
        aria-label="Filter slots"
        className="ml-auto flex flex-wrap items-center gap-2"
        role="group"
      >
        {filters.map((option) => {
          const active = option.id === filter;
          return (
            <button
              aria-pressed={active}
              className={cn(
                "rounded-md border-3 px-3 py-1 font-body text-[18px] focus-visible:ring-3 focus-visible:ring-gold focus-visible:outline-none",
                active
                  ? "border-ink bg-bark text-paper shadow-drop-2"
                  : "border-sand-strong bg-paper text-ink hover:border-bark",
              )}
              key={option.id}
              onClick={() => onFilterChange(option.id)}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
