import { Check, ChevronRight } from "lucide-react";
import type { IconName } from "@/shared/components/farm-ui";
import { CircularProgress, PixelIcon } from "@/shared/components/farm-ui";
import type { BoardRoom } from "../types/board.types";
import { cn } from "@/shared/lib/utils";

const roomIcons: Record<string, IconName> = {
  pantry: "jar",
  "crafts-room": "logs",
  "fish-tank": "fish",
  "boiler-room": "gem",
  vault: "coin",
  "bulletin-board": "pin",
};

export function RoomProgressRail({
  rooms,
  activeRoomId,
  onSelect,
  compact = false,
}: {
  rooms: BoardRoom[];
  activeRoomId?: number;
  onSelect: (room: BoardRoom) => void;
  compact?: boolean;
}) {
  return (
    <div
      aria-label="Community Center rooms"
      className={cn(
        "grid auto-cols-[minmax(11rem,1fr)] grid-flow-col gap-3 overflow-x-auto pb-2",
        !compact && "lg:grid-flow-row lg:grid-cols-6 lg:overflow-visible",
      )}
      role="navigation"
    >
      {rooms.map((room) => (
        <button
          className={cn(
            "group flex min-h-20 items-center gap-3 rounded-xl border-2 p-3 text-left shadow-drop-2 transition-[transform,border-color,background-color] hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-harvest",
            activeRoomId === room.id
              ? "border-[var(--season-accent)] bg-[var(--season-soft)]"
              : "border-sand-strong bg-paper hover:border-soil",
          )}
          key={room.id}
          onClick={() => onSelect(room)}
          type="button"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-lg border-2 border-bark bg-parchment">
            {room.progress.complete ? (
              <Check aria-hidden className="text-leaf-dark" size={22} strokeWidth={3} />
            ) : (
              <PixelIcon name={roomIcons[room.slug] ?? "sprout"} size={24} />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-lg font-bold text-ink">
              {room.name}
            </span>
            <span className="block font-ui text-xs text-ink-soft">
              {room.progress.completed}/{room.progress.total} bundles
            </span>
          </span>
          {compact ? (
            <ChevronRight aria-hidden className="text-soil" size={17} />
          ) : (
            <CircularProgress
              className="hidden xl:grid"
              max={room.progress.total}
              size={46}
              value={room.progress.completed}
            />
          )}
        </button>
      ))}
    </div>
  );
}
