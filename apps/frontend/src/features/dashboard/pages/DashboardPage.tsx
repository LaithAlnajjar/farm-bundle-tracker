import { useMutation } from '@tanstack/react-query';
import { LogOut, Sprout, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/features/auth';
import { ChunkyButton, NoteCard, WoodBoard } from '@/shared/components/farm-ui';

export function DashboardPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate('/', { replace: true }),
  });

  return (
    <main className="dot-grid min-h-screen text-foreground">
      <section className="page-container py-8 sm:py-12">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 font-pixel text-sm text-secondary">
              <Sprout className="size-4" aria-hidden />
              <span>FARM BUNDLE TRACKER</span>
            </div>
            <h1 className="font-pixel text-[42px] leading-none text-primary sm:text-[56px]">
              Bundle Board
            </h1>
          </div>

          <ChunkyButton
            className="self-start text-lg disabled:cursor-not-allowed disabled:opacity-75"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            variant="secondary"
          >
            <LogOut className="size-5" aria-hidden />
            {logoutMutation.isPending ? 'Signing out...' : 'Sign out'}
          </ChunkyButton>
        </header>

        <WoodBoard innerClassName="grid gap-4 bg-parchment bg-none p-4 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] sm:p-5">
          <NoteCard headerLabel="TODAY" pin="red" tone="primary">
            <div className="space-y-3">
              <p className="font-body text-lg font-extrabold text-secondary">
                Your account is ready.
              </p>
              <p className="font-body text-sm font-bold text-foreground/75">
                Protected farm work can live here next.
              </p>
            </div>
          </NoteCard>

          <NoteCard headerLabel="FARMER" pin="green" tone="spring">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center border-2 border-wood bg-primary text-primary-foreground">
                <UserRound className="size-5" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="font-pixel text-xl leading-none text-secondary">
                  {user?.username}
                </p>
                <p className="mt-1 break-words font-body text-sm font-bold text-foreground/70">
                  {user?.email}
                </p>
              </div>
            </div>
          </NoteCard>
        </WoodBoard>
      </section>
    </main>
  );
}
