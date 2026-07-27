import { useState } from "react";
import { FarmAppShell, type FarmDashboardTab } from "@/features/farms/components/FarmAppShell";
import { BoardHero } from "../components/BoardHero";
import { BoardOverview } from "../components/BoardOverview";
import { BoardRoomsView } from "../components/BoardRoomsView";
import { BoardTasksView } from "../components/BoardTasksView";
import { dashboardFixture } from "../fixtures/board.fixture";
import type { BoardActions, BoardPreferences } from "../types/board.types";

const actions: BoardActions = {
  collect: () => undefined,
  claim: () => undefined,
  release: () => undefined,
  isSlotPending: () => false,
};

export function BoardDesignFixturePage() {
  const [preferences, setPreferences] = useState<BoardPreferences>({
    tab: "overview",
    room: "pantry",
    q: "",
    status: "all",
    season: "current",
    assignee: "me",
  });
  const update = (patch: Partial<BoardPreferences>) =>
    setPreferences((current) => ({ ...current, ...patch }));
  const currentMembership = dashboardFixture.claimableMembers[0];

  return (
    <FarmAppShell
      activeTab={preferences.tab}
      farm={dashboardFixture.farm}
      onTabChange={(tab: FarmDashboardTab) => update({ tab })}
    >
      <main className="page-container space-y-5 px-3 py-4 sm:px-8 sm:py-7">
        <BoardHero
          board={dashboardFixture}
          dataUpdatedAt={1}
          isFetching={false}
          onRefresh={() => undefined}
          onSeasonChange={() => undefined}
          seasonPending={false}
        />
        {preferences.tab === "overview" ? (
          <BoardOverview
            actions={actions}
            board={dashboardFixture}
            currentMembership={currentMembership}
            currentUserId={1}
            onNavigate={update}
          />
        ) : null}
        {preferences.tab === "rooms" ? (
          <BoardRoomsView
            actions={actions}
            board={dashboardFixture}
            currentMembership={currentMembership}
            currentUserId={1}
            onChange={update}
            preferences={preferences}
          />
        ) : null}
        {preferences.tab === "tasks" ? (
          <BoardTasksView
            actions={actions}
            board={dashboardFixture}
            currentMembership={currentMembership}
            currentUserId={1}
            onChange={update}
            preferences={preferences}
          />
        ) : null}
      </main>
    </FarmAppShell>
  );
}
