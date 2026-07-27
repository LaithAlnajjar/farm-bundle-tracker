import * as Toast from "@radix-ui/react-toast";
import { useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  FarmToastContext,
  type FarmToastInput,
} from "./useFarmToast";

type ToastMessage = {
  id: number;
  title: string;
  description?: string;
  tone?: "success" | "error" | "info";
  actionLabel?: string;
  onAction?: () => void;
};

export function FarmToastProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const nextId = useRef(1);
  const value = useMemo(
    () => ({
      showToast: (message: FarmToastInput) => {
        const id = nextId.current++;
        setMessages((current) => [...current.slice(-2), { ...message, id }]);
      },
    }),
    [],
  );

  return (
    <FarmToastContext.Provider value={value}>
      <Toast.Provider duration={4500} swipeDirection="right">
        {children}
        {messages.map((message) => (
          <Toast.Root
            className="grid grid-cols-[1fr_auto] gap-x-4 rounded-lg border-3 border-bark bg-paper p-4 font-ui text-ink shadow-drop-6 data-[state=open]:animate-toast-in"
            key={message.id}
            onOpenChange={(open) => {
              if (!open) {
                setMessages((current) =>
                  current.filter((item) => item.id !== message.id),
                );
              }
            }}
          >
            <div>
              <Toast.Title className="font-display text-xl font-bold">
                {message.title}
              </Toast.Title>
              {message.description ? (
                <Toast.Description
                  className={`mt-0.5 text-sm ${
                    message.tone === "error" ? "text-berry-ink" : "text-ink-soft"
                  }`}
                >
                  {message.description}
                </Toast.Description>
              ) : null}
            </div>
            <div className="flex items-start gap-1">
              {message.actionLabel && message.onAction ? (
                <Toast.Action asChild altText={message.actionLabel}>
                  <button
                    className="min-h-11 rounded-md border-2 border-bark bg-gold-soft px-3 font-display font-bold text-ink"
                    onClick={message.onAction}
                    type="button"
                  >
                    {message.actionLabel}
                  </button>
                </Toast.Action>
              ) : null}
              <Toast.Close
                aria-label="Dismiss"
                className="grid size-11 place-items-center rounded-md text-ink-soft hover:bg-parchment"
              >
                <X aria-hidden size={18} />
              </Toast.Close>
            </div>
          </Toast.Root>
        ))}
        <Toast.Viewport className="fixed right-3 bottom-20 z-[120] flex w-[min(calc(100vw-1.5rem),24rem)] flex-col gap-3 outline-none sm:right-5 sm:bottom-5" />
      </Toast.Provider>
    </FarmToastContext.Provider>
  );
}
