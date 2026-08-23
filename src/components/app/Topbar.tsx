import type { ReactNode } from "react";
import { Inline } from "@/components/layout/Inline";

export function Topbar({ children }: { children: ReactNode }) {
  return (
    <Inline asChild align="center" justify="between">
      <header className="select-none border-b border-[var(--line)] bg-[var(--panel)] px-[18px]">
        {children}
      </header>
    </Inline>
  );
}
