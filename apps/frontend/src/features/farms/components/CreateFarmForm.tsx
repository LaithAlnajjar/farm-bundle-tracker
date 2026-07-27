import type { SubmitEvent } from "react";
import { ChunkyButton } from "@/shared/components/farm-ui";
import { cn } from "@/shared/lib/utils";

type CreateFarmFormProps = {
  error?: string;
  isPending: boolean;
  onSubmit: (name: string) => void;
  className?: string;
};

export function CreateFarmForm({
  error,
  isPending,
  onSubmit,
  className,
}: CreateFarmFormProps) {
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit(String(data.get("name") ?? "").trim());
  };

  return (
    <form
      className={cn(
        "flex flex-col gap-3 rounded-lg border-2 border-sand-strong bg-parchment p-4",
        className,
      )}
      onSubmit={handleSubmit}
    >
      <label className="flex-1 font-ui text-sm font-bold text-ink">
        New farm
        <input
          autoFocus
          className="mt-1.5 min-h-11 w-full rounded-lg border-2 border-bark bg-paper px-3 font-ui text-base font-normal outline-none focus:border-harvest focus:ring-3 focus:ring-harvest/20"
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
        <p className="font-ui text-sm text-berry sm:basis-full" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
