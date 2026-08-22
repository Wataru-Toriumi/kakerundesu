import type { ReactNode } from "react";

export function LibraryFolder({ title, children }: { title: string; children: ReactNode }) {
  return <div className="flex min-w-0 items-center gap-[7px] border-b border-[var(--line)] px-3 text-[11px] text-[var(--app-muted)] [&>svg]:size-3.5 [&>svg]:shrink-0 max-[720px]:hidden" title={title}>{children}</div>;
}
