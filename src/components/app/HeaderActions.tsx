import type { ReactNode } from "react";
import { Inline } from "@/components/layout/Inline";

export function HeaderActions({ children }: { children: ReactNode }) {
  return (
    <Inline asChild gap="2">
      <nav aria-label="ファイル操作">{children}</nav>
    </Inline>
  );
}
