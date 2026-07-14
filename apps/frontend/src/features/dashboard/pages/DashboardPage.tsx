import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useAuth } from '@/features/auth';
import {
  ChunkyButton,
  NoteCard,
  PixelIcon,
  WoodBoard,
} from '@/shared/components/farm-ui';

export function DashboardPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate('/', { replace: true }),
  });

  return (
    <main className="min-h-screen bg-background">
      <section className="page-container px-8 py-10 sm:py-14">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 font-micro text-[11px] tracking-[2.5px] uppercase text-berry">
              <PixelIcon name="sprout" size={16} />
              Co-op farm tracker
            </div>
            <h1 className="mt-2 font-display text-5xl leading-none font-bold text-ink sm:text-[56px]">
              Bundle Board
            </h1>
          </div>

          <ChunkyButton
            className="self-start"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            variant="secondary"
          >
            {logoutMutation.isPending ? 'Signing out…' : 'Sign out'}
          </ChunkyButton>
        </header>

        <WoodBoard innerClassName="grid gap-6 p-6 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] sm:p-7">
          <NoteCard pin rotate={-0.6} className="p-5 pt-6">
            <div className="font-micro text-[10px] tracking-[2px] uppercase text-soil">
              Today
            </div>
            <p className="mt-2 font-display text-2xl font-bold text-ink">
              Your account is ready.
            </p>
            <p className="mt-1 font-body text-xl text-ink-soft">
              Protected farm work can live here next.
            </p>
          </NoteCard>

          <NoteCard pin rotate={0.8} className="p-5 pt-6">
            <div className="font-micro text-[10px] tracking-[2px] uppercase text-soil">
              Farmer
            </div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-sm border-3 border-harvest bg-paper">
                <PixelIcon name="sprout" size={24} />
              </div>
              <div className="min-w-0 leading-tight">
                <p className="font-display text-[22px] font-bold text-ink">
                  {user?.username}
                </p>
                <p className="mt-0.5 font-body text-lg break-words text-ink-soft">
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
