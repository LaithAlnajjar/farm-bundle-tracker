import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router";
import { useAuth } from "@/features/auth";
import { useRedeemFarmInvite } from "../hooks/useRedeemFarmInvite";
import { previewFarmInvite } from "../services";
import {
  ChunkyButton,
  NoteCard,
  PixelIcon,
  chunkyButtonVariants,
} from "@/shared/components/farm-ui";
import { cn } from "@/shared/lib/utils";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function JoinFarmPage() {
  const token = useParams().token ?? "";
  const navigate = useNavigate();
  const { isAuthenticated, status } = useAuth();
  const previewQuery = useQuery({
    queryKey: ["farm-invite", token],
    queryFn: () => previewFarmInvite(token),
    enabled: token.length > 0,
    retry: false,
  });
  const redeemMutation = useRedeemFarmInvite(token, (farm) => {
    navigate(`/farms/${farm.id}`, { replace: true });
  });
  const redirect = `/join/${encodeURIComponent(token)}`;
  const authQuery = `?redirect=${encodeURIComponent(redirect)}`;

  return (
    <main className="farm-canvas flex min-h-screen items-center justify-center px-4 py-12 font-ui" data-season="spring">
      <NoteCard className="w-full max-w-xl rounded-2xl border-3 border-bark bg-paper p-7 text-center shadow-drop-8 sm:p-9">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl border-3 border-leaf bg-leaf-soft shadow-drop-3">
          <PixelIcon name="sprout" size={36} />
        </span>
        {previewQuery.isPending ? (
          <h1 className="mt-3 font-display text-3xl font-bold text-ink">
            Checking invite…
          </h1>
        ) : null}
        {previewQuery.isError ? (
          <>
            <h1 className="mt-3 font-display text-4xl font-bold text-ink">
              Invite unavailable
            </h1>
            <p className="mt-2 font-ui text-sm leading-relaxed text-ink-soft">
              This link is invalid, expired, or has been revoked.
            </p>
          </>
        ) : null}
        {previewQuery.data ? (
          <>
            <p className="mt-3 font-micro text-[11px] tracking-[2px] uppercase text-soil">
              Farm invitation
            </p>
            <h1 className="mt-2 font-display text-4xl font-bold text-ink">
              Join {previewQuery.data.farmName}?
            </h1>
            <p className="mt-2 font-ui text-sm leading-relaxed text-ink-soft">
              You’ll join as an editor and can help update the bundle board.
            </p>
            <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border-2 border-leaf bg-leaf-soft px-3 py-1.5 font-ui text-xs font-bold text-leaf-dark">
              <ShieldCheck aria-hidden size={16} /> Invite verified
            </p>

            {status === "loading" ? (
              <p className="mt-5 font-ui text-sm text-ink-soft">
                Loading your account…
              </p>
            ) : isAuthenticated ? (
              <ChunkyButton
                className="mt-6"
                disabled={redeemMutation.isPending}
                onClick={() => redeemMutation.mutate()}
              >
                {redeemMutation.isPending ? "Joining…" : "Join farm"}
                {!redeemMutation.isPending ? <ArrowRight aria-hidden size={18} /> : null}
              </ChunkyButton>
            ) : (
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  className={cn(chunkyButtonVariants(), "no-underline")}
                  to={`/signin${authQuery}`}
                >
                  Sign in to join
                </Link>
                <Link
                  className={cn(
                    chunkyButtonVariants({ variant: "secondary" }),
                    "no-underline",
                  )}
                  to={`/register${authQuery}`}
                >
                  Create account
                </Link>
              </div>
            )}

            {redeemMutation.isError ? (
              <p className="mt-4 font-ui text-sm text-berry" role="alert">
                The invite could not be redeemed. It may have expired.
              </p>
            ) : null}
          </>
        ) : null}
      </NoteCard>
    </main>
  );
}
