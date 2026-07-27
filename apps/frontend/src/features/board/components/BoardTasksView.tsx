import { ClipboardCheck } from "lucide-react";
import { NoteCard, UserBadge } from "@/shared/components/farm-ui";
import type {
  BoardActions,
  BoardMember,
  BoardPreferences,
  FarmBoard,
} from "../types/board.types";
import {
  filterBoardItems,
  flattenBoard,
  getMemberClaimCounts,
} from "../lib/boardSelectors";
import { BoardFilters } from "./BoardFilters";
import { BoardItemList } from "./BoardItemList";
import { cn } from "@/shared/lib/utils";

export function BoardTasksView({
  board,
  currentUserId,
  currentMembership,
  preferences,
  actions,
  onChange,
}: {
  board: FarmBoard;
  currentUserId?: number;
  currentMembership?: BoardMember;
  preferences: BoardPreferences;
  actions: BoardActions;
  onChange: (
    patch: Partial<BoardPreferences>,
    options?: { replace?: boolean },
  ) => void;
}) {
  const memberCounts = getMemberClaimCounts(board);
  const items = filterBoardItems({
    items: flattenBoard(board),
    preferences: { ...preferences, status: "claimed" },
    currentSeason: board.farm.currentSeason,
    currentUserId,
    requireClaim: true,
  });
  const selectedName =
    preferences.assignee === "me"
      ? "My tasks"
      : preferences.assignee === "all"
        ? "Everyone's tasks"
        : board.claimableMembers.find(
              (member) => member.membershipId === Number(preferences.assignee),
            )?.username ?? "Assigned tasks";

  return (
    <div className="space-y-5">
      <section>
        <div className="mb-3">
          <p className="font-micro text-[9px] tracking-[0.12em] text-soil uppercase">
            Farm team
          </p>
          <h2 className="font-display text-3xl font-bold text-ink">
            Work by person
          </h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            className={cn(
              "flex min-h-14 shrink-0 items-center gap-2 rounded-xl border-2 px-3 font-ui text-sm font-bold shadow-drop-2",
              preferences.assignee === "all"
                ? "border-harvest bg-gold-soft"
                : "border-sand-strong bg-paper",
            )}
            onClick={() => onChange({ assignee: "all" })}
            type="button"
          >
            Everyone
          </button>
          {memberCounts.map(({ member, count }) => {
            const value =
              member.userId === currentUserId
                ? ("me" as const)
                : (`${member.membershipId}` as `${number}`);
            return (
              <button
                className={cn(
                  "flex min-h-14 shrink-0 items-center gap-2 rounded-xl border-2 px-3 font-ui text-sm font-bold shadow-drop-2",
                  preferences.assignee === value ||
                    (preferences.assignee === `${member.membershipId}`)
                    ? "border-harvest bg-gold-soft"
                    : "border-sand-strong bg-paper",
                )}
                key={member.membershipId}
                onClick={() => onChange({ assignee: value })}
                type="button"
              >
                <UserBadge
                  size="sm"
                  userId={member.userId}
                  username={member.username}
                />
                {member.username}
                <span className="rounded-full bg-parchment px-2 py-0.5 font-display text-xs">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <BoardFilters
        members={board.claimableMembers}
        onChange={onChange}
        onClear={() =>
          onChange({ q: "", status: "all", season: "current", assignee: "me" })
        }
        preferences={{ ...preferences, status: "claimed" }}
        resultCount={items.length}
        taskMode
      />

      <NoteCard className="rounded-xl border-3 border-bark bg-paper shadow-drop-4">
        <div className="border-b-2 border-dashed border-soil/25 p-4">
          <p className="inline-flex items-center gap-2 font-micro text-[9px] tracking-[0.12em] text-fall-ink uppercase">
            <ClipboardCheck aria-hidden size={15} /> Assignments
          </p>
          <h2 className="mt-1 font-display text-3xl font-bold text-ink">
            {selectedName}
          </h2>
          <p className="mt-1 font-ui text-sm text-ink-soft capitalize">
            {preferences.season === "current"
              ? `${board.farm.currentSeason} only`
              : preferences.season === "all"
                ? "All seasons"
                : `${preferences.season} only`}
          </p>
        </div>
        <div className="p-3 sm:p-4">
          {items.length ? (
            <BoardItemList
              actions={actions}
              canEdit={board.canEdit}
              currentMembership={currentMembership}
              items={items}
              members={board.claimableMembers}
            />
          ) : (
            <div className="rounded-xl border-2 border-dashed border-leaf bg-leaf-soft p-8 text-center">
              <ClipboardCheck aria-hidden className="mx-auto text-leaf-dark" size={32} />
              <h3 className="mt-3 font-display text-2xl font-bold text-leaf-dark">
                Nothing assigned here
              </h3>
              <p className="mt-1 font-ui text-sm text-ink-soft">
                Change the teammate or season, or claim an available item from Overview.
              </p>
            </div>
          )}
        </div>
      </NoteCard>
    </div>
  );
}
