import type { ReactNode } from "react";

export function MarkdownBody({ children }: { children: ReactNode }) {
  return <article className="markdown-body overflow-auto px-[clamp(24px,5vw,72px)] pt-6 pb-20 leading-[1.8]">{children}</article>;
}
