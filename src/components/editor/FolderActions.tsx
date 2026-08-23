import type { ReactNode } from "react";
import { Inline } from "@/components/layout/Inline";

export function FolderActions({ children }: { children: ReactNode }) {
  return (
    <Inline asChild position="absolute" right="3px" top="3px">
      <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100">{children}</div>
    </Inline>
  );
}
