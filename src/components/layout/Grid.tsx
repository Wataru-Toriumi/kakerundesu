import { Grid as RadixGrid } from "@radix-ui/themes/components/grid";
import type { GridLayoutProps } from "@/components/layout/layoutProps";

export function Grid({ children, ...props }: GridLayoutProps) {
  return (
    <RadixGrid data-slot="grid" {...props}>
      {children}
    </RadixGrid>
  );
}
