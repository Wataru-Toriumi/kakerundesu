import type { ReactNode } from "react";
import { Inline } from "@/components/layout/Inline";
import { cn } from "@/lib/utils";

type TreeRowProps = {
  children: ReactNode;
  depth: number;
  kind: "folder" | "file";
  active?: boolean;
  title?: string;
  onClick: () => void;
};

export function TreeRow({ children, depth, kind, active, title, onClick }: TreeRowProps) {
  return (
    <Inline
      asChild
      align="center"
      gap="2"
      minHeight="30px"
      pl={`${(kind === "folder" ? 8 : 24) + depth * 14}px`}
      pr={kind === "folder" ? "54px" : "8px"}
      width="100%"
    >
      <button
        className={cn(
          "rounded-md border-0 bg-transparent text-left text-[11px] text-[var(--app-muted)] hover:bg-[var(--code)] hover:text-inherit [&>span]:overflow-hidden [&>span]:text-ellipsis [&>span]:whitespace-nowrap",
          kind === "folder" && "font-semibold text-inherit",
          active && "bg-[var(--code)] text-[var(--app-accent)]",
        )}
        onClick={onClick}
        title={title}
      >
        {children}
      </button>
    </Inline>
  );
}
