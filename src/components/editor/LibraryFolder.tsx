import type { ReactNode } from "react";
import { Inline } from "@/components/layout/Inline";

export function LibraryFolder({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Inline asChild align="center" gap="2" minWidth="0">
      <div
        className="border-b border-[var(--line)] px-3 text-[11px] text-[var(--app-muted)] [&>svg]:size-3.5 [&>svg]:shrink-0 max-[720px]:hidden"
        title={title}
      >
        {children}
      </div>
    </Inline>
  );
}
