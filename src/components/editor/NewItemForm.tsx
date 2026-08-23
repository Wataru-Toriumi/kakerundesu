import type { FormEvent, ReactNode } from "react";
import { Inline } from "@/components/layout/Inline";

type NewItemFormProps = { children: ReactNode; depth: number; onSubmit: () => void };

export function NewItemForm({ children, depth, onSubmit }: NewItemFormProps) {
  return (
    <Inline
      asChild
      align="center"
      gap="1"
      height="32px"
      pl={`${24 + (depth + 1) * 14}px`}
      pr="5px"
    >
      <form
        className="text-[var(--app-accent)]"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        {children}
      </form>
    </Inline>
  );
}
