import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FolderChevron({ children, expanded }: { children: ReactNode; expanded: boolean }) {
  return <span className={cn("[&>svg]:size-3 transition-transform", expanded && "rotate-90")}>{children}</span>;
}
