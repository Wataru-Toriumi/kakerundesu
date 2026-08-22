import type { ReactNode } from "react";

export function LibraryLayout({ children }: { children: ReactNode }) {
  return <aside className="grid min-h-0 min-w-0 grid-rows-[36px_38px_1fr_48px] border-r border-[var(--line)] bg-[var(--panel)] max-[720px]:grid-rows-[36px_1fr_42px] max-[720px]:border-r-0 max-[720px]:border-b">{children}</aside>;
}
