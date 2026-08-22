import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return <main className="grid h-full grid-rows-[64px_1fr_28px] bg-[var(--canvas)]">{children}</main>;
}
