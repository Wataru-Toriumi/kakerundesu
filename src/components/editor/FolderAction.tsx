import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function FolderAction({ children, label, title, onClick }: { children: ReactNode; label: string; title: string; onClick: () => void }) {
  return <Button variant="ghost" size="icon" className="size-6 text-[var(--app-muted)] hover:bg-[var(--panel)] hover:text-[var(--app-accent)] [&_svg]:size-[13px]" onClick={onClick} aria-label={label} title={title}>{children}</Button>;
}
