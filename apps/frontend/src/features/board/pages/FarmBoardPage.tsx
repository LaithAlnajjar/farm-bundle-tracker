import { useEffect, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { useAuth } from "@/features/auth";
import { FarmAppShell } from "@/features/farms/components/FarmAppShell";
import { ChunkyButton, NoteCard, PixelIcon, useFarmToast } from "@/shared/components/farm-ui";
import { BoardHero } from "../components/BoardHero";
import { BoardOverview } from "../components/BoardOverview";
import { BoardRoomsView } from "../components/BoardRoomsView";
import { BoardTasksView } from "../components/BoardTasksView";
import { useBoardMutations } from "../hooks/useBoardMutations";
import { useBoardPreferences } from "../hooks/useBoardPreferences";
import { useFarmBoard } from "../hooks/useFarmBoard";
import type { BoardActions, FarmBoard } from "../types/board.types";
import {
  boardFingerprint,
  describeBoardChange,
} from "../lib/boardChanges";

export function FarmBoardPage() {
  const farmId = Number(useParams().farmId);
  const { user } = useAuth();
  const { showToast } = useFarmToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const boardQuery = useFarmBoard(farmId);
  const localFingerprints = useRef(new Set<string>());
  const previousBoard = useRef<FarmBoard | null>(null);
  const preferencesState = useBoardPreferences({
    farmId,
    userId: user?.id,
    searchParams,
    setSearchParams,
  });
  const mutations = useBoardMutations(farmId, (fingerprint) =>
    localFingerprints.current.add(fingerprint),
  );

  useEffect(() => {
    const board = boardQuery.data;
    if (!board) return;
    const fingerprint = boardFingerprint(board);
    const isLocal = localFingerprints.current.delete(fingerprint);
    if (previousBoard.current && !isLocal) {
      const notice = describeBoardChange(previousBoard.current, board);
      if (notice) {
        showToast({
          title: notice.title,
          description: notice.description,
          tone: "info",
        });
      }
    }
    previousBoard.current = board;
  }, [boardQuery.data, showToast]);

  if (!Number.isInteger(farmId) || farmId <= 0) {
    return <BoardMessage message="This bundle board address is invalid." />;
  }
  if (boardQuery.isPending) {
    return <BoardMessage message="Pinning up your farm dashboard…" loading />;
  }
  if (boardQuery.isError || !boardQuery.data) {
    return (
      <BoardMessage
        action={
          <ChunkyButton onClick={() => void boardQuery.refetch()}>
            Try again
          </ChunkyButton>
        }
        message="This farm dashboard could not be loaded."
      />
    );
  }

  const board = boardQuery.data;
  const preferences = preferencesState.preferences;
  const currentMembership = board.claimableMembers.find(
    (member) => member.userId === user?.id,
  );
  const actions: BoardActions = {
    collect: (slotId, collected) =>
      mutations.collection.mutate({ slotId, collected }),
    claim: (slotId, membershipId) =>
      mutations.claim.mutate({ slotId, membershipId }),
    release: (slotId) => mutations.release.mutate(slotId),
    isSlotPending: mutations.isSlotPending,
  };

  return (
    <FarmAppShell
      activeTab={preferences.tab}
      farm={board.farm}
      onTabChange={(tab) =>
        preferencesState.updatePreferences(
          tab === "rooms"
            ? { tab, assignee: "all" }
            : tab === "tasks"
              ? { tab, assignee: "me" }
              : { tab },
        )
      }
    >
      <main className="page-container space-y-5 px-3 py-4 sm:px-8 sm:py-7">
        <BoardHero
          board={board}
          dataUpdatedAt={boardQuery.dataUpdatedAt}
          isFetching={boardQuery.isFetching}
          onRefresh={() => void boardQuery.refetch()}
          onSeasonChange={(season) => mutations.season.mutate(season)}
          seasonPending={mutations.season.isPending}
        />

        {preferences.tab === "overview" ? (
          <BoardOverview
            actions={actions}
            board={board}
            currentMembership={currentMembership}
            currentUserId={user?.id}
            onNavigate={(patch) => preferencesState.updatePreferences(patch)}
          />
        ) : null}

        {preferences.tab === "rooms" ? (
          <BoardRoomsView
            actions={actions}
            board={board}
            currentMembership={currentMembership}
            currentUserId={user?.id}
            onChange={preferencesState.updatePreferences}
            preferences={preferences}
          />
        ) : null}

        {preferences.tab === "tasks" ? (
          <BoardTasksView
            actions={actions}
            board={board}
            currentMembership={currentMembership}
            currentUserId={user?.id}
            onChange={preferencesState.updatePreferences}
            preferences={preferences}
          />
        ) : null}
      </main>
    </FarmAppShell>
  );
}

function BoardMessage({
  message,
  action,
  loading = false,
}: {
  message: string;
  action?: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <main className="farm-canvas flex min-h-screen items-center justify-center px-5 font-ui" data-season="spring">
      <NoteCard className="max-w-xl rounded-xl border-3 border-bark bg-paper p-8 text-center shadow-drop-6">
        <PixelIcon name="sprout" size={40} />
        <p className="mt-3 font-display text-2xl font-bold text-ink" role={loading ? "status" : undefined}>
          {message}
        </p>
        {action ? <div className="mt-4">{action}</div> : null}
        <Link
          className="mt-4 inline-flex min-h-11 items-center font-display text-lg font-bold text-berry underline"
          to="/farms"
        >
          Back to farms
        </Link>
      </NoteCard>
    </main>
  );
}
