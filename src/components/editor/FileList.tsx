import type { ReactNode } from "react";

export function FileList({ children }: { children: ReactNode }) {
  return <div className="min-h-0 overflow-auto p-[7px] [&_svg]:size-3.5 [&_svg]:shrink-0">{children}</div>;
}
