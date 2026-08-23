import { Theme } from "@radix-ui/themes/components/theme";
import type { ReactNode } from "react";

export function AppTheme({ children }: { children: ReactNode }) {
  return (
    <Theme className="h-full" hasBackground={false}>
      {children}
    </Theme>
  );
}
