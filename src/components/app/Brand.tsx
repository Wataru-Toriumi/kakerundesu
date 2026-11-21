import { Box } from "@/components/layout/Box";
import { Inline } from "@/components/layout/Inline";
import { Stack } from "@/components/layout/Stack";
import appIcon from "../../../src-tauri/icons/128x128.png";

export function Brand({ fileName, isDirty }: { fileName: string; isDirty: boolean }) {
  return (
    <Inline align="center" gap="3" minWidth="0">
      <img src={appIcon} alt="" width={34} height={34} className="shrink-0" />
      <Stack minWidth="0">
        <strong className="text-sm tracking-[.02em]">かけるんです</strong>
        <Box asChild maxWidth="42vw" mt="2px">
          <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-[var(--app-muted)]">
            {fileName}{isDirty ? " •" : ""}
          </span>
        </Box>
      </Stack>
    </Inline>
  );
}
