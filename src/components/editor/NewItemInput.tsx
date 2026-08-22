import type { InputHTMLAttributes } from "react";

export function NewItemInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className="h-[25px] min-w-0 flex-1 rounded-[5px] border border-[var(--app-accent)] bg-[var(--panel)] px-1.5 font-mono text-[11px] text-inherit outline-none" />;
}
