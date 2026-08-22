import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Pane({ children, kind }: { children: ReactNode; kind: "editor" | "preview" }) {
  return <section className={cn("grid h-full min-h-0 min-w-0 grid-rows-[36px_1fr] bg-[var(--panel)]", kind === "editor" ? "border-r border-[var(--line)] max-[720px]:border-r-0 max-[720px]:border-b" : "overflow-hidden")}>{children}</section>;
}
