import { Inline } from "@/components/layout/Inline";
import { cn } from "@/lib/utils";

export function PaneTitle({ title, meta, library = false }: { title: string; meta: string; library?: boolean }) {
  return (
    <Inline asChild align="center" justify="between">
      <div
        className={cn(
          "select-none border-b border-[var(--line)] px-4 text-[10px] font-bold tracking-[.12em] text-[var(--app-muted)]",
          library && "px-3",
        )}
      >
        <span>{title}</span>
        <span>{meta}</span>
      </div>
    </Inline>
  );
}
