import { useState } from "react";
import { Plus, Sprout } from "lucide-react";
import { useNavigate } from "react-router";
import { FarmCard } from "@/features/farms/components/FarmCard";
import { CreateFarmForm } from "@/features/farms/components/CreateFarmForm";
import { FarmAppShell } from "@/features/farms/components/FarmAppShell";
import { useCreateFarm } from "@/features/farms/hooks/useCreateFarm";
import { useFarms } from "@/features/farms/hooks/useFarms";
import {
  ChunkyButton,
  FarmDialog,
  NoteCard,
  PixelIcon,
} from "@/shared/components/farm-ui";

export function FarmsPage() {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const farmsQuery = useFarms();
  const createMutation = useCreateFarm((farm) => navigate(`/farms/${farm.id}`));

  return (
    <FarmAppShell>
      <main className="page-container px-4 py-7 sm:px-8 sm:py-10">
        <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-micro text-[10px] tracking-[0.14em] text-berry uppercase">
              Your co-op saves
            </p>
            <h1 className="mt-1 font-display text-5xl leading-none font-bold text-ink sm:text-6xl">
              My farms
            </h1>
            <p className="mt-2 max-w-xl font-ui text-sm leading-relaxed text-ink-soft sm:text-base">
              Jump back into seasonal work, assignments, and Community Center progress.
            </p>
          </div>
          <ChunkyButton className="self-start" onClick={() => setCreateOpen(true)}>
            <Plus aria-hidden size={19} /> New farm
          </ChunkyButton>
        </header>

        {farmsQuery.isPending ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading farms">
            {[0, 1, 2].map((item) => (
              <div
                className="min-h-64 animate-pulse rounded-2xl border-3 border-sand-strong bg-paper/75 shadow-drop-4"
                key={item}
              />
            ))}
          </div>
        ) : null}

        {farmsQuery.isError ? (
          <NoteCard className="mx-auto max-w-xl rounded-xl border-3 border-bark bg-paper p-8 text-center shadow-drop-5">
            <PixelIcon name="mushroom" size={38} />
            <h2 className="mt-3 font-display text-3xl font-bold text-ink">
              Your farms could not be loaded
            </h2>
            <p className="mt-2 font-ui text-sm text-ink-soft">
              Check your connection and try once more.
            </p>
            <ChunkyButton className="mt-5" onClick={() => void farmsQuery.refetch()}>
              Try again
            </ChunkyButton>
          </NoteCard>
        ) : null}

        {farmsQuery.isSuccess && farmsQuery.data.length === 0 ? (
          <NoteCard className="mx-auto max-w-2xl rounded-2xl border-3 border-bark bg-paper p-9 text-center shadow-drop-6">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl border-3 border-leaf bg-leaf-soft">
              <Sprout aria-hidden className="text-leaf-dark" size={32} />
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold text-ink">
              Plant your first board
            </h2>
            <p className="mx-auto mt-2 max-w-md font-ui text-sm leading-relaxed text-ink-soft">
              Create a farm, invite your co-op group, and see exactly what the Community Center needs next.
            </p>
            <ChunkyButton className="mt-6" onClick={() => setCreateOpen(true)}>
              <Plus aria-hidden size={19} /> Create farm
            </ChunkyButton>
          </NoteCard>
        ) : null}

        {farmsQuery.isSuccess && farmsQuery.data.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {farmsQuery.data.map((farm) => (
              <FarmCard farm={farm} key={farm.id} />
            ))}
          </div>
        ) : null}
      </main>

      <FarmDialog
        description="Every new farm starts in Spring with the complete vanilla Community Center board."
        onOpenChange={setCreateOpen}
        open={createOpen}
        title="Create a new farm"
      >
        <CreateFarmForm
          error={createMutation.error?.message}
          isPending={createMutation.isPending}
          onSubmit={(name) => createMutation.mutate(name)}
        />
      </FarmDialog>
    </FarmAppShell>
  );
}
