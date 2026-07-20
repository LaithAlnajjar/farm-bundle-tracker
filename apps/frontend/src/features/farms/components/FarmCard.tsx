import type { Farm } from "@/features/farms/types/farm.types";
import { NoteCard, PixelIcon } from "@/shared/components/farm-ui";
import { formatDate } from "@/shared/lib/formatDate";
import { Link } from "react-router";

interface FarmCardProps {
  farm: Farm;
  rotate?: number;
}

export function FarmCard({ farm, rotate }: FarmCardProps) {
  return (
    <NoteCard pin rotate={rotate} className="flex min-h-48 flex-col p-5 pt-7">
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-sm border-3 border-harvest bg-parchment">
          <PixelIcon name="sprout" size={24} />
        </div>
        <div className="min-w-0">
          <p className="font-micro text-[10px] tracking-[2px] uppercase text-soil">
            Farm
          </p>
          <h2 className="mt-1 font-display text-3xl leading-tight font-bold break-words text-ink">
            {farm.name}
          </h2>
        </div>
      </div>

      <div className="seam-dashed mt-auto pt-4 font-body text-lg text-ink-soft">
        <div className="flex items-center justify-between gap-3">
          <span className="capitalize">{farm.membershipRole}</span>
          <time dateTime={farm.createdAt}>{formatDate(farm.createdAt)}</time>
        </div>
        <Link
          className="mt-3 inline-flex font-display text-lg font-bold text-berry underline decoration-2 underline-offset-3"
          to={`/farms/${farm.id}/manage`}
        >
          Manage farm
        </Link>
      </div>
    </NoteCard>
  );
}
