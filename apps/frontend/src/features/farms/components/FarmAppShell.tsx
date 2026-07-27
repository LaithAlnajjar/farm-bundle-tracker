import { useMutation } from "@tanstack/react-query";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  Warehouse,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/features/auth";
import type { FarmRole, FarmSeason } from "../types/farm.types";
import { PixelIcon, StatusBadge, UserBadge } from "@/shared/components/farm-ui";
import { cn } from "@/shared/lib/utils";

export type FarmDashboardTab = "overview" | "rooms" | "tasks";

const tabs = [
  { value: "overview" as const, label: "Overview", icon: LayoutDashboard },
  { value: "rooms" as const, label: "Rooms", icon: Warehouse },
  { value: "tasks" as const, label: "My Tasks", icon: ClipboardList },
];

export function FarmAppShell({
  children,
  farm,
  activeTab,
  onTabChange,
}: {
  children: React.ReactNode;
  farm?: {
    id: number;
    name: string;
    currentSeason: FarmSeason;
    membershipRole: FarmRole;
  };
  activeTab?: FarmDashboardTab;
  onTabChange?: (tab: FarmDashboardTab) => void;
}) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate("/", { replace: true }),
  });

  return (
    <div
      className={cn(
        "farm-canvas min-h-screen font-ui text-ink",
        farm && onTabChange && "pb-20 lg:pb-0",
      )}
      data-season={farm?.currentSeason ?? "spring"}
    >
      <header className="sticky top-0 z-50 border-b-3 border-bark bg-soil text-paper shadow-drop-4">
        <div className="page-container flex min-h-16 items-center gap-3 px-4 sm:px-8">
          <Link
            className="flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:ring-3 focus-visible:ring-gold"
            to="/farms"
          >
            <span className="grid size-10 place-items-center rounded-sm border-2 border-bark bg-gold shadow-drop-2">
              <PixelIcon name="sprout" size={22} />
            </span>
            <span className="hidden font-display text-xl font-bold sm:block">
              Bundle Board
            </span>
          </Link>

          {farm ? (
            <>
              <span className="hidden text-linen sm:block">/</span>
              <div className="min-w-0 flex-1 sm:flex-none">
                <p className="truncate font-display text-lg font-bold sm:text-xl">
                  {farm.name}
                </p>
                <p className="font-micro text-[8px] tracking-[0.1em] text-linen uppercase sm:hidden">
                  {farm.currentSeason} · {farm.membershipRole}
                </p>
              </div>
              <StatusBadge className="hidden sm:inline-flex" tone="neutral">
                {farm.membershipRole}
                {farm.membershipRole === "viewer" ? " · read only" : ""}
              </StatusBadge>
            </>
          ) : (
            <span className="min-w-0 flex-1 font-display text-lg font-bold sm:text-xl">
              My Farms
            </span>
          )}

          {farm && onTabChange ? (
            <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Farm dashboard">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    className={cn(
                      "inline-flex min-h-11 items-center gap-2 rounded-md px-3 font-display font-bold",
                      activeTab === tab.value
                        ? "bg-paper text-bark"
                        : "text-linen hover:bg-bark/45 hover:text-paper",
                    )}
                    key={tab.value}
                    onClick={() => onTabChange(tab.value)}
                    type="button"
                  >
                    <Icon aria-hidden size={17} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          ) : null}

          <div className="ml-auto flex items-center gap-1.5 lg:ml-2">
            {farm ? (
              <Link
                aria-label="Farm settings"
                className="grid size-11 place-items-center rounded-md text-linen hover:bg-bark/45 hover:text-paper focus-visible:ring-3 focus-visible:ring-gold"
                to={`/farms/${farm.id}/manage`}
              >
                <Settings aria-hidden size={20} />
              </Link>
            ) : null}
            {user ? (
              <UserBadge
                className="hidden border-gold sm:inline-flex"
                size="sm"
                userId={user.id}
                username={user.username}
              />
            ) : null}
            <button
              aria-label="Sign out"
              className="grid size-11 place-items-center rounded-md text-linen hover:bg-bark/45 hover:text-paper focus-visible:ring-3 focus-visible:ring-gold disabled:opacity-60"
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
              type="button"
            >
              <LogOut aria-hidden size={19} />
            </button>
          </div>
        </div>
      </header>

      {children}

      {farm && onTabChange ? (
        <nav
          aria-label="Farm dashboard"
          className="fixed right-0 bottom-0 left-0 z-50 grid grid-cols-3 border-t-3 border-bark bg-paper shadow-[0_-4px_0_rgb(62_39_18_/_0.16)] lg:hidden"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 font-display text-sm font-bold",
                  activeTab === tab.value
                    ? "bg-[var(--season-soft)] text-[var(--season-ink)]"
                    : "text-ink-soft",
                )}
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                type="button"
              >
                <Icon aria-hidden size={21} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
