import { Flex } from "@radix-ui/themes/components/flex";
import type { FlexLayoutProps } from "@/components/layout/layoutProps";

export function Inline({ children, ...props }: FlexLayoutProps) {
  return (
    <Flex data-slot="inline" direction="row" {...props}>
      {children}
    </Flex>
  );
}
