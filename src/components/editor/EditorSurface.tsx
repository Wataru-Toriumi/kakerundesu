import type { ReactNode } from "react";
import { Box } from "@/components/layout/Box";

export function EditorSurface({ children }: { children: ReactNode }) {
  return (
    <Box asChild minHeight="0" overflow="auto">
      <div className="cm-theme bg-[var(--editor)]">{children}</div>
    </Box>
  );
}
