import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function ChooseFolderButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <Button variant="outline" size="sm" onClick={onClick} className="w-full min-w-0 border-[var(--line)] bg-transparent text-[11px] text-inherit hover:bg-[var(--code)] hover:text-inherit [&_svg]:size-3.5">{children}</Button>;
}
