import type { ReactNode } from "react";

export function FolderLine({ children }: { children: ReactNode }) {
  return <div className="group relative flex min-w-0">{children}</div>;
}
