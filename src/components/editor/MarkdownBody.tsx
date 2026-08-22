import type { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MarkdownBody({ children }: { children: ReactNode }) {
  return <ScrollArea className="min-h-0"><article className="markdown-body px-[clamp(24px,5vw,72px)] pt-6 pb-20 leading-[1.8]">{children}</article></ScrollArea>;
}
