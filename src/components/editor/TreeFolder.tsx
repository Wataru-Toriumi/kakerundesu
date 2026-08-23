import type { ReactNode } from "react";
import { Box } from "@/components/layout/Box";

export function TreeFolder({ children }: { children: ReactNode }) {
  return <Box minWidth="0">{children}</Box>;
}
