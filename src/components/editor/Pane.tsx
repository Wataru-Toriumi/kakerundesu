import type { ReactNode } from "react";
import { Grid } from "@/components/layout/Grid";
import { cn } from "@/lib/utils";

export function Pane({ children, kind }: { children: ReactNode; kind: "editor" | "preview" }) {
  return (
    <Grid asChild rows="36px minmax(0, 1fr)">
      <section
        className={cn(
          "h-full min-h-0 min-w-0 bg-[var(--panel)]",
          kind === "editor"
            ? "border-r border-[var(--line)] max-[720px]:border-r-0 max-[720px]:border-b"
            : "overflow-hidden",
        )}
      >
        {children}
      </section>
    </Grid>
  );
}
