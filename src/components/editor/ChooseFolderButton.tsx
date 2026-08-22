import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function ChooseFolderButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <Button variant="outline" onClick={onClick} className="m-[7px] h-auto gap-[7px] border-[var(--line)] bg-transparent text-[11px] text-inherit hover:bg-[var(--code)] hover:text-inherit [&_svg]:size-3.5">{children}</Button>;
}
