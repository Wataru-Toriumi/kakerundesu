import type { ReactNode } from "react";

export function TruncatedText({ children }: { children: ReactNode }) {
  return <span className="overflow-hidden text-ellipsis whitespace-nowrap">{children}</span>;
}
