import { useMutation } from "@tanstack/react-query";
import { LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/features/auth";
import type { FarmRole, FarmSeason } from "../types/farm.types";
import { PixelIcon, StatusBadge, UserBadge } from "@/shared/components/farm-ui";

/**
 * Header shell for the pages around the board — the farm list and farm
 * settings. The board itself ships its own full-height dashboard chrome.
 */
export function FarmAppShell({
  children,
  farm,
}: {
  children: React.ReactNode;
  farm?: {
    id: number;
    name: string;
    currentSeason: FarmSeason;
    membershipRole: FarmRole;
  };
}) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate("/", { replace: true }),
  });

  return (
    <div className="min-h-screen bg-background font-body text-ink">
      <header className="sticky top-0 z-50 border-b-3 border-ink bg-bark text-paper shadow-drop-4">
        <div className="page-container flex min-h-16 items-center gap-3 px-4 sm:px-8">
          <Link
            className="flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:ring-3 focus-visible:ring-gold"
            to="/farms"
          >
            <span className="grid size-10 place-items-center rounded-sm border-2 border-ink bg-gold shadow-drop-2">
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

          <div className="ml-auto flex items-center gap-1.5">
            {farm ? (
              <Link
                aria-label="Farm settings"
                className="grid size-11 place-items-center rounded-md text-linen hover:bg-ink/45 hover:text-paper focus-visible:ring-3 focus-visible:ring-gold"
                to={`/farms/${farm.id}/manage`}
              >
                <Settings aria-hidden size={20} />
              </Link>
            ) : null}
            {user ? (
              <UserBadge
                className="hidden border-ink sm:inline-flex"
                size="sm"
                userId={user.id}
                username={user.username}
              />
            ) : null}
            <button
              aria-label="Sign out"
              className="grid size-11 place-items-center rounded-md text-linen hover:bg-ink/45 hover:text-paper focus-visible:ring-3 focus-visible:ring-gold disabled:opacity-60"
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
    </div>
  );
}
