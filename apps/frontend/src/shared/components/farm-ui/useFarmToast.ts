import { createContext, useContext } from "react";

export type FarmToastInput = {
  title: string;
  description?: string;
  tone?: "success" | "error" | "info";
  actionLabel?: string;
  onAction?: () => void;
};

export const FarmToastContext = createContext<
  { showToast: (message: FarmToastInput) => void } | undefined
>(undefined);

export function useFarmToast() {
  const context = useContext(FarmToastContext);
  if (!context) throw new Error("useFarmToast must be used within FarmToastProvider");
  return context;
}
