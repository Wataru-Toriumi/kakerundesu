import type { ReactNode } from "react";

export function EditorSurface({ children }: { children: ReactNode }) {
  return <div className="cm-theme min-h-0 overflow-auto bg-[var(--editor)]">{children}</div>;
}
