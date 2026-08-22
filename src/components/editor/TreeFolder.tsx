import type { ReactNode } from "react";

export function TreeFolder({ children }: { children: ReactNode }) {
  return <div className="min-w-0">{children}</div>;
}
