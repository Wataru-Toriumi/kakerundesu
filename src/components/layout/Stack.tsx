import { Flex } from "@radix-ui/themes/components/flex";
import type { FlexLayoutProps } from "@/components/layout/layoutProps";

export function Stack({ children, ...props }: FlexLayoutProps) {
  return (
    <Flex data-slot="stack" direction="column" {...props}>
      {children}
    </Flex>
  );
}
