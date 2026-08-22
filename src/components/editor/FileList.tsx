import type { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function FileList({ children }: { children: ReactNode }) {
  return <ScrollArea className="min-h-0 [&_svg]:size-3.5 [&_svg]:shrink-0"><div className="p-[7px]">{children}</div></ScrollArea>;
}
