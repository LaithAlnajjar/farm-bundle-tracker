import type { SubmitEvent } from "react";
import { ChunkyButton } from "@/shared/components/farm-ui";

type CreateFarmFormProps = {
  error?: string;
  isPending: boolean;
  onSubmit: (name: string) => void;
};

export function CreateFarmForm({
  error,
  isPending,
  onSubmit,
}: CreateFarmFormProps) {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit(String(data.get("name") ?? "").trim());
    if (!isPending) form.reset();
  };

  return (
    <form
      className="mb-6 flex flex-col gap-3 rounded-sm border-3 border-bark bg-parchment p-4 sm:flex-row sm:items-end"
      onSubmit={handleSubmit}
    >
      <label className="flex-1 font-display text-lg font-bold text-ink">
        New farm
        <input
          className="mt-1.5 w-full rounded-sm border-3 border-bark bg-paper px-3 py-2 font-body text-xl font-normal outline-none focus:border-harvest"
          maxLength={255}
          name="name"
          placeholder="Four Corners Farm"
          required
        />
      </label>
      <ChunkyButton disabled={isPending} type="submit">
        {isPending ? "Planting…" : "Create farm"}
      </ChunkyButton>
      {error ? (
        <p className="font-body text-lg text-berry sm:basis-full" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
