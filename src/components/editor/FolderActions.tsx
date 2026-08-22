import type { ReactNode } from "react";

export function FolderActions({ children }: { children: ReactNode }) {
  return <div className="absolute top-[3px] right-[3px] flex opacity-0 group-hover:opacity-100 focus-within:opacity-100">{children}</div>;
}
