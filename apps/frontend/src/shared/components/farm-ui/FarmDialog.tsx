import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export function FarmDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-ink/55 backdrop-blur-[1px] data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className={cn(
            "fixed right-0 bottom-0 left-0 z-[90] max-h-[90vh] overflow-y-auto rounded-t-xl border-3 border-bark bg-paper p-5 shadow-drop-10 outline-none data-[state=open]:animate-sheet-in sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:w-[min(92vw,34rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:p-6",
            className,
          )}
        >
          <div className="pr-10">
            <Dialog.Title className="font-display text-3xl font-bold text-ink">
              {title}
            </Dialog.Title>
            {description ? (
              <Dialog.Description className="mt-1 font-ui text-sm leading-relaxed text-ink-soft">
                {description}
              </Dialog.Description>
            ) : null}
          </div>
          <Dialog.Close
            aria-label="Close"
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-md border-2 border-soil bg-parchment text-ink hover:bg-oat focus-visible:ring-3 focus-visible:ring-harvest"
          >
            <X aria-hidden size={20} />
          </Dialog.Close>
          <div className="mt-5">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
