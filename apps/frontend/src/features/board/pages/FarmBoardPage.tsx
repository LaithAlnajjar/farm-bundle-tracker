import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { useAuth } from "@/features/auth";
import {
  ChunkyButton,
  NoteCard,
  PixelIcon,
  useFarmToast,
} from "@/shared/components/farm-ui";
import { BoardDashboard } from "../components/BoardDashboard";
import { useBoardMutations } from "../hooks/useBoardMutations";
import { useBoardPreferences } from "../hooks/useBoardPreferences";
import { useFarmBoard } from "../hooks/useFarmBoard";
import { boardFingerprint, describeBoardChange } from "../lib/boardChanges";
import type { BoardActions, FarmBoard } from "../types/board.types";

export function FarmBoardPage() {
  const farmId = Number(useParams().farmId);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
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
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate("/", { replace: true }),
  });

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
    return <BoardMessage loading message="Pinning up your farm dashboard…" />;
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

  const actions: BoardActions = {
    collect: (slotId, collected) =>
      mutations.collection.mutate({ slotId, collected }),
    claim: (slotId, membershipId) =>
      mutations.claim.mutate({ slotId, membershipId }),
    release: (slotId) => mutations.release.mutate(slotId),
    isSlotPending: mutations.isSlotPending,
  };

  return (
    <BoardDashboard
      actions={actions}
      board={boardQuery.data}
      currentUser={user ?? undefined}
      isFetching={boardQuery.isFetching}
      onPreferencesChange={preferencesState.updatePreferences}
      onRefresh={() => void boardQuery.refetch()}
      onSeasonChange={(season) => mutations.season.mutate(season)}
      onSignOut={() => logoutMutation.mutate()}
      preferences={preferencesState.preferences}
      seasonPending={mutations.season.isPending}
    />
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
    <main className="flex min-h-screen items-center justify-center bg-background px-5">
      <NoteCard className="max-w-xl p-8 text-center">
        <PixelIcon name="sprout" size={40} />
        <p
          className="mt-3 font-display text-2xl font-bold text-ink"
          role={loading ? "status" : undefined}
        >
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
