import type { FlexProps } from "@radix-ui/themes/components/flex";
import type { GridProps } from "@radix-ui/themes/components/grid";

export type LayoutGap = "0" | "1" | "2" | "3" | "4";

type LayoutProps = Pick<
  FlexProps,
  | "asChild"
  | "bottom"
  | "children"
  | "flexGrow"
  | "flexShrink"
  | "height"
  | "left"
  | "maxHeight"
  | "maxWidth"
  | "minHeight"
  | "minWidth"
  | "overflow"
  | "overflowX"
  | "overflowY"
  | "p"
  | "pb"
  | "pl"
  | "position"
  | "pr"
  | "pt"
  | "px"
  | "py"
  | "right"
  | "top"
  | "width"
>;

export type FlexLayoutProps = LayoutProps &
  Pick<FlexProps, "align" | "justify" | "wrap"> & {
    gap?: LayoutGap;
  };

export type GridLayoutProps = LayoutProps &
  Pick<
    GridProps,
    | "align"
    | "alignContent"
    | "areas"
    | "columns"
    | "flow"
    | "justify"
    | "justifyItems"
    | "rows"
  > & {
    gap?: LayoutGap;
    gapX?: LayoutGap;
    gapY?: LayoutGap;
  };
