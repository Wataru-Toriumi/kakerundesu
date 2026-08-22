import type { ReactNode } from "react";

export function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <section className="grid min-h-0 grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)] max-[720px]:grid-cols-1 max-[720px]:grid-rows-[160px_1fr_1fr]">{children}</section>;
}
