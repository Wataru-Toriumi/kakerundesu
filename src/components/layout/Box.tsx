import { Box as RadixBox } from "@radix-ui/themes/components/box";
import type { BoxLayoutProps } from "@/components/layout/layoutProps";

export function Box({ children, ...props }: BoxLayoutProps) {
  return (
    <RadixBox data-slot="box" {...props}>
      {children}
    </RadixBox>
  );
}
