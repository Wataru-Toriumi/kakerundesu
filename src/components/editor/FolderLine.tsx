import type { ReactNode } from "react";
import { Inline } from "@/components/layout/Inline";

export function FolderLine({ children }: { children: ReactNode }) {
  return (
    <Inline asChild minWidth="0" position="relative">
      <div className="group">{children}</div>
    </Inline>
  );
}
