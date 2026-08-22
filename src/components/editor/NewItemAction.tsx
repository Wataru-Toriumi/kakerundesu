import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function NewItemAction({ children, type, label, onClick }: { children: ReactNode; type: "submit" | "button"; label: string; onClick?: () => void }) {
  return <Button variant="ghost" size="icon" type={type} onClick={onClick} aria-label={label} className="size-[23px] text-[var(--app-muted)] hover:bg-[var(--code)] hover:text-[var(--app-accent)] [&_svg]:size-3">{children}</Button>;
}
