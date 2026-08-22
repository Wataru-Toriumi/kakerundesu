import type { CSSProperties, ReactNode } from "react";
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
  const style: CSSProperties = { paddingLeft: (kind === "folder" ? 8 : 24) + depth * 14 };
  return <button className={cn("flex min-h-[30px] w-full items-center gap-1.5 rounded-md border-0 bg-transparent pr-2 text-left text-[11px] text-[var(--app-muted)] hover:bg-[var(--code)] hover:text-inherit [&>span]:overflow-hidden [&>span]:text-ellipsis [&>span]:whitespace-nowrap", kind === "folder" && "pr-[54px] font-semibold text-inherit", active && "bg-[var(--code)] text-[var(--app-accent)]")} style={style} onClick={onClick} title={title}>{children}</button>;
}
