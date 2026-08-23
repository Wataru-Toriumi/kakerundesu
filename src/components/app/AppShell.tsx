import type { ReactNode } from "react";
import { Grid } from "@/components/layout/Grid";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider delay={400}>
      <Grid asChild height="100%" rows="64px minmax(0, 1fr) 28px">
        <main className="bg-[var(--canvas)]">{children}</main>
      </Grid>
    </TooltipProvider>
  );
}
