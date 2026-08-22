import type { FormEvent, ReactNode } from "react";

type NewItemFormProps = { children: ReactNode; depth: number; onSubmit: () => void };

export function NewItemForm({ children, depth, onSubmit }: NewItemFormProps) {
  return <form className="flex h-8 items-center gap-1 pr-[5px] text-[var(--app-accent)]" style={{ paddingLeft: 24 + (depth + 1) * 14 }} onSubmit={(event: FormEvent) => { event.preventDefault(); onSubmit(); }}>{children}</form>;
}
