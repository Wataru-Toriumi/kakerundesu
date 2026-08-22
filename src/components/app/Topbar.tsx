import type { ReactNode } from "react";

export function Topbar({ children }: { children: ReactNode }) {
  return <header className="flex select-none items-center justify-between border-b border-[var(--line)] bg-[var(--panel)] px-[18px]">{children}</header>;
}
