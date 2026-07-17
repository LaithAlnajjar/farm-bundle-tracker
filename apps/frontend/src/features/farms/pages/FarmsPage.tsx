import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/features/auth';
import { FarmCard } from '@/features/farms/components/FarmCard';
import { useFarms } from '@/features/farms/hooks/useFarms';
import {
  ChunkyButton,
  NoteCard,
  PixelIcon,
  WoodBoard,
} from '@/shared/components/farm-ui';

export function FarmsPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const farmsQuery = useFarms();
  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => navigate('/', { replace: true }),
  });

  return (
    <main className="min-h-screen bg-background">
      <section className="page-container px-5 py-8 sm:px-8 sm:py-12">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-micro text-[11px] tracking-[2.5px] uppercase text-berry"
            >
              <PixelIcon name="sprout" size={16} />
              Bundle Board
            </Link>
            <h1 className="mt-2 font-display text-5xl leading-none font-bold text-ink sm:text-[56px]">
              My farms
            </h1>
            <p className="mt-2 font-body text-xl text-ink-soft sm:text-2xl">
              Welcome back, {user?.username ?? 'farmer'}.
            </p>
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

        <WoodBoard innerClassName="p-5 sm:p-7">
          {farmsQuery.isPending ? (
            <NoteCard pin className="mx-auto max-w-xl p-7 text-center">
              <p
                className="inline-flex items-center gap-3 font-display text-2xl font-bold text-ink"
                role="status"
              >
                <span
                  aria-hidden
                  className="size-3 animate-ping-dot border border-leaf-dark bg-leaf"
                />
                Loading your farms…
              </p>
            </NoteCard>
          ) : null}

          {farmsQuery.isError ? (
            <NoteCard pin className="mx-auto max-w-xl p-7 text-center">
              <PixelIcon name="mushroom" size={36} />
              <h2 className="mt-3 font-display text-3xl font-bold text-ink">
                The farms could not be loaded
              </h2>
              <p className="mt-2 font-body text-xl text-ink-soft">
                Check your connection, then try again.
              </p>
              <ChunkyButton
                className="mt-5"
                onClick={() => void farmsQuery.refetch()}
              >
                Try again
              </ChunkyButton>
            </NoteCard>
          ) : null}

          {farmsQuery.isSuccess && farmsQuery.data.length === 0 ? (
            <NoteCard pin className="mx-auto max-w-xl p-7 text-center">
              <PixelIcon name="sprout" size={48} />
              <h2 className="mt-3 font-display text-3xl font-bold text-ink">
                No farms yet
              </h2>
              <p className="mt-2 font-body text-xl text-ink-soft">
                Farms connected to your account will appear here.
              </p>
            </NoteCard>
          ) : null}

          {farmsQuery.isSuccess && farmsQuery.data.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {farmsQuery.data.map((farm, index) => (
                <FarmCard
                  key={farm.id}
                  farm={farm}
                  rotate={index % 2 === 0 ? -0.4 : 0.4}
                />
              ))}
            </div>
          ) : null}
        </WoodBoard>
      </section>
    </main>
  );
}
