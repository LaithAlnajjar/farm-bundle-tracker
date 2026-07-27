import { ChevronRight, ClipboardCheck, Sprout, Users } from "lucide-react";
import { NoteCard, UserBadge } from "@/shared/components/farm-ui";
import type {
  BoardActions,
  BoardMember,
  BoardPreferences,
  FarmBoard,
} from "../types/board.types";
import { getMemberClaimCounts, getOverviewData } from "../lib/boardSelectors";
import { BoardItemList } from "./BoardItemList";
import { RoomProgressRail } from "./RoomProgressRail";

export function BoardOverview({
  board,
  currentUserId,
  currentMembership,
  actions,
  onNavigate,
}: {
  board: FarmBoard;
  currentUserId?: number;
  currentMembership?: BoardMember;
  actions: BoardActions;
  onNavigate: (patch: Partial<BoardPreferences>) => void;
}) {
  const overview = getOverviewData(board, currentUserId);
  const memberCounts = getMemberClaimCounts(board);
  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(19rem,0.75fr)]">
        <div className="space-y-5">
          <NoteCard className="overflow-hidden rounded-xl border-3 border-bark bg-paper shadow-drop-4">
            <div className="flex items-start justify-between gap-3 border-b-2 border-dashed border-soil/25 p-4">
              <div>
                <p className="inline-flex items-center gap-2 font-micro text-[9px] tracking-[0.12em] text-fall-ink uppercase">
                  <ClipboardCheck aria-hidden size={15} /> Your plan
                </p>
                <h2 className="mt-1 font-display text-3xl font-bold text-ink">
                  My next tasks
                </h2>
                <p className="mt-1 font-ui text-sm text-ink-soft capitalize">
                  {board.farm.currentSeason} work first
                </p>
              </div>
              <button
                className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 font-display font-bold text-berry hover:bg-berry-mist"
                onClick={() =>
                  onNavigate({ tab: "tasks", assignee: "me", season: "current" })
                }
                type="button"
              >
                View tasks <ChevronRight aria-hidden size={17} />
              </button>
            </div>
            <div className="p-3 sm:p-4">
              {overview.myCurrentSeasonClaims.length ? (
                <BoardItemList
                  actions={actions}
                  canEdit={board.canEdit}
                  currentMembership={currentMembership}
                  items={overview.myCurrentSeasonClaims}
                  members={board.claimableMembers}
                />
              ) : (
                <div className="rounded-xl border-2 border-dashed border-leaf bg-leaf-soft p-5 text-center">
                  <Sprout aria-hidden className="mx-auto text-leaf-dark" size={28} />
                  <p className="mt-2 font-display text-xl font-bold text-leaf-dark">
                    You&apos;re clear this season
                  </p>
                  <p className="mt-1 font-ui text-sm text-ink-soft">
                    Pick an available item below when you&apos;re ready to help.
                  </p>
                </div>
              )}
              {overview.myLaterClaims.length ? (
                <details className="mt-3">
                  <summary className="min-h-11 cursor-pointer rounded-md px-2 py-3 font-display font-bold text-soil hover:bg-parchment">
                    Later-season tasks · {overview.myLaterClaims.length}
                  </summary>
                  <div className="mt-2">
                    <BoardItemList
                      actions={actions}
                      canEdit={board.canEdit}
                      currentMembership={currentMembership}
                      items={overview.myLaterClaims}
                      members={board.claimableMembers}
                    />
                  </div>
                </details>
              ) : null}
            </div>
          </NoteCard>

          <NoteCard className="rounded-xl border-3 border-bark bg-paper shadow-drop-4">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b-2 border-dashed border-soil/25 p-4">
              <div>
                <p className="inline-flex items-center gap-2 font-micro text-[9px] tracking-[0.12em] text-leaf-dark uppercase">
                  <Sprout aria-hidden size={15} /> Available now
                </p>
                <h2 className="mt-1 font-display text-3xl font-bold text-ink">
                  Unclaimed {board.farm.currentSeason} work
                </h2>
              </div>
              {overview.availableNow.length > 6 ? (
                <button
                  className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 font-display font-bold text-berry hover:bg-berry-mist"
                  onClick={() =>
                    onNavigate({
                      tab: "rooms",
                      status: "unclaimed",
                      season: "current",
                      assignee: "all",
                    })
                  }
                  type="button"
                >
                  View all {overview.availableNow.length}
                  <ChevronRight aria-hidden size={17} />
                </button>
              ) : null}
            </div>
            <div className="p-3 sm:p-4">
              {overview.availablePreview.length ? (
                <BoardItemList
                  actions={actions}
                  canEdit={board.canEdit}
                  currentMembership={currentMembership}
                  items={overview.availablePreview}
                  members={board.claimableMembers}
                />
              ) : (
                <div className="rounded-xl border-2 border-dashed border-gold-deep bg-gold-soft p-5 text-center">
                  <p className="font-display text-xl font-bold text-gold-ink">
                    Seasonal work is covered
                  </p>
                  <p className="mt-1 font-ui text-sm text-ink-soft">
                    Everything needed now is collected or already claimed.
                  </p>
                </div>
              )}
            </div>
          </NoteCard>
        </div>

        <aside className="space-y-5">
          <NoteCard className="rounded-xl border-3 border-bark bg-paper p-4 shadow-drop-4">
            <p className="inline-flex items-center gap-2 font-micro text-[9px] tracking-[0.12em] text-soil uppercase">
              <Users aria-hidden size={15} /> Farm team
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink">
              Who&apos;s getting what
            </h2>
            <div className="mt-3 space-y-2">
              {memberCounts.map(({ member, count }) => (
                <button
                  className="flex min-h-14 w-full items-center gap-3 rounded-xl border-2 border-sand-strong bg-parchment p-2.5 text-left hover:border-harvest hover:bg-gold-soft focus-visible:ring-3 focus-visible:ring-harvest"
                  key={member.membershipId}
                  onClick={() =>
                    onNavigate({
                      tab: "tasks",
                      assignee: `${member.membershipId}`,
                      season: "current",
                    })
                  }
                  type="button"
                >
                  <UserBadge
                    userId={member.userId}
                    username={member.username}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-ui text-sm font-bold text-ink">
                      {member.username}
                      {member.userId === currentUserId ? " (you)" : ""}
                    </span>
                    <span className="font-ui text-xs text-ink-soft capitalize">
                      {member.role}
                    </span>
                  </span>
                  <span className="rounded-full border-2 border-soil bg-paper px-2.5 py-1 font-display text-sm font-bold text-soil">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </NoteCard>

          <NoteCard className="rounded-xl border-3 border-bark bg-paper p-4 shadow-drop-4">
            <p className="font-micro text-[9px] tracking-[0.12em] text-soil uppercase">
              At a glance
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl border-2 border-harvest bg-gold-soft p-3">
                <dt className="font-ui text-xs font-bold text-gold-ink">Available now</dt>
                <dd className="mt-1 font-display text-3xl font-bold text-ink">
                  {overview.availableNow.length}
                </dd>
              </div>
              <div className="rounded-xl border-2 border-fall bg-fall-soft p-3">
                <dt className="font-ui text-xs font-bold text-fall-ink">My claims</dt>
                <dd className="mt-1 font-display text-3xl font-bold text-ink">
                  {overview.myCurrentSeasonClaims.length + overview.myLaterClaims.length}
                </dd>
              </div>
            </dl>
          </NoteCard>
        </aside>
      </div>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="font-micro text-[9px] tracking-[0.12em] text-soil uppercase">
              Community Center
            </p>
            <h2 className="font-display text-3xl font-bold text-ink">Room progress</h2>
          </div>
        </div>
        <RoomProgressRail
          onSelect={(room) =>
            onNavigate({ tab: "rooms", room: room.slug, q: "", assignee: "all" })
          }
          rooms={board.rooms}
        />
      </section>
    </div>
  );
}
