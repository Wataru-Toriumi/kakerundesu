import type { ReactNode } from "react";
import { Grid } from "@/components/layout/Grid";

export function LibraryLayout({ children }: { children: ReactNode }) {
  return (
    <Grid asChild rows="36px 38px minmax(0, 1fr) 48px">
      <aside className="h-full min-h-0 min-w-0 border-r border-[var(--line)] bg-[var(--panel)] max-[720px]:grid-rows-[36px_1fr_42px] max-[720px]:border-r-0 max-[720px]:border-b">
        {children}
      </aside>
    </Grid>
  );
}
