import { useState } from "react";
import { BoardDashboard } from "../components/BoardDashboard";
import { dashboardFixture } from "../fixtures/board.fixture";
import { defaultBoardPreferences } from "../lib/boardPreferences";
import type { BoardActions, BoardPreferences } from "../types/board.types";

const actions: BoardActions = {
  collect: () => undefined,
  claim: () => undefined,
  release: () => undefined,
  isSlotPending: () => false,
};

const currentUser = { id: 1, username: "laith" };

/** Dev-only harness: the dashboard against fixed data, with no API behind it. */
export function BoardDesignFixturePage() {
  const [preferences, setPreferences] = useState<BoardPreferences>({
    ...defaultBoardPreferences,
    room: "pantry",
  });

  return (
    <BoardDashboard
      actions={actions}
      board={dashboardFixture}
      currentUser={currentUser}
      isFetching={false}
      onPreferencesChange={(patch) =>
        setPreferences((current) => ({ ...current, ...patch }))
      }
      onRefresh={() => undefined}
      onSeasonChange={() => undefined}
      onSignOut={() => undefined}
      preferences={preferences}
      seasonPending={false}
    />
  );
}
