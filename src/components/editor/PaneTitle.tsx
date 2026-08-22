import { cn } from "@/lib/utils";

export function PaneTitle({ title, meta, library = false }: { title: string; meta: string; library?: boolean }) {
  return <div className={cn("flex select-none items-center justify-between border-b border-[var(--line)] px-4 text-[10px] font-bold tracking-[.12em] text-[var(--app-muted)]", library && "px-3")}><span>{title}</span><span>{meta}</span></div>;
}
