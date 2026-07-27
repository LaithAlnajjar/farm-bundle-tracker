import { ArrowRight, ClipboardCheck, Settings, Sprout } from "lucide-react";
import { Link } from "react-router";
import type { FarmListItem } from "@/features/farms/types/farm.types";
import { ProgressBar, StatusBadge } from "@/shared/components/farm-ui";

export function FarmCard({ farm }: { farm: FarmListItem }) {
  return (
    <article
      className="group flex min-h-64 flex-col rounded-2xl border-3 border-bark bg-paper p-5 shadow-drop-5 transition-transform hover:-translate-y-1"
      data-season={farm.currentSeason}
    >
      <div className="flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl border-2 border-bark bg-[var(--season-soft)] text-[var(--season-ink)]">
          <Sprout aria-hidden size={24} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="neutral">{farm.membershipRole}</StatusBadge>
            <span className="font-micro text-[9px] tracking-[0.08em] text-[var(--season-ink)] uppercase">
              {farm.currentSeason}
            </span>
          </div>
          <h2 className="mt-2 truncate font-display text-3xl leading-tight font-bold text-ink">
            {farm.name}
          </h2>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between font-ui text-xs font-bold text-ink-soft">
          <span>Community Center</span>
          <span>{farm.summary.progress.percentage}%</span>
        </div>
        <ProgressBar
          label={`${farm.summary.progress.percentage}% complete`}
          max={farm.summary.progress.total}
          value={farm.summary.progress.completed}
        />
        <p className="mt-1.5 font-ui text-xs text-ink-soft">
          {farm.summary.progress.completed}/{farm.summary.progress.total} bundles
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border-2 border-fall bg-fall-soft p-3">
          <p className="inline-flex items-center gap-1 font-ui text-xs font-bold text-fall-ink">
            <ClipboardCheck aria-hidden size={14} /> My tasks
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            {farm.summary.myActiveClaims}
          </p>
        </div>
        <div className="rounded-xl border-2 border-[var(--season-accent)] bg-[var(--season-soft)] p-3">
          <p className="font-ui text-xs font-bold text-[var(--season-ink)]">
            Needed now
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            {farm.summary.currentSeasonNeededItems}
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-5">
        <Link
          className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border-2 border-bark bg-harvest px-3 font-display font-bold text-paper shadow-drop-3 hover:translate-y-0.5 hover:shadow-drop-2 focus-visible:ring-3 focus-visible:ring-gold"
          to={`/farms/${farm.id}`}
        >
          Open dashboard <ArrowRight aria-hidden size={17} />
        </Link>
        <Link
          aria-label={`Manage ${farm.name}`}
          className="grid size-11 place-items-center rounded-lg border-2 border-bark bg-parchment text-bark hover:bg-oat focus-visible:ring-3 focus-visible:ring-harvest"
          to={`/farms/${farm.id}/manage`}
        >
          <Settings aria-hidden size={19} />
        </Link>
      </div>
    </article>
  );
}
