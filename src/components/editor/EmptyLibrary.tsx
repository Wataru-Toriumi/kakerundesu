import type { ReactNode } from "react";

export function EmptyLibrary({ children }: { children: ReactNode }) {
  return <p className="mx-2.5 my-4 text-[11px] leading-[1.6] text-[var(--app-muted)]">{children}</p>;
}
