import type { ComponentProps } from "react";
import { Input } from "@/components/ui/input";

export function NewItemInput(props: ComponentProps<typeof Input>) {
  return <Input {...props} className="h-[25px] min-w-0 flex-1 rounded-[5px] border-[var(--app-accent)] bg-[var(--panel)] px-1.5 font-mono text-[11px] text-inherit focus-visible:border-[var(--app-accent)] focus-visible:ring-[var(--app-accent)]/30" />;
}
