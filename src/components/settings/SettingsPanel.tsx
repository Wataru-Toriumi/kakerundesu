import type { ReactNode } from "react";
import { DialogContent } from "@/components/ui/dialog";

export function SettingsPanel({ children }: { children: ReactNode }) {
  return (
    <DialogContent className="gap-6 bg-[var(--panel)] p-6 text-foreground">
      {children}
    </DialogContent>
  );
}
