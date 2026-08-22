import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delay={400}>
      <main className="grid h-full grid-rows-[64px_1fr_28px] bg-[var(--canvas)]">{children}</main>
    </TooltipProvider>
  );
}
