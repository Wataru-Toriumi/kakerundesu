import type { ReactNode } from "react";

export function HeaderActions({ children }: { children: ReactNode }) {
  return <nav className="flex gap-[7px]" aria-label="ファイル操作">{children}</nav>;
}
