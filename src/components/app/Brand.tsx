import { Box } from "@/components/layout/Box";
import { Grid } from "@/components/layout/Grid";
import { Inline } from "@/components/layout/Inline";
import { Stack } from "@/components/layout/Stack";

export function Brand({ fileName, isDirty }: { fileName: string; isDirty: boolean }) {
  return (
    <Inline align="center" gap="3" minWidth="0">
      <Grid asChild align="center" height="34px" justifyItems="center" width="34px">
        <span className="rounded-[10px] bg-[var(--app-accent)] font-extrabold text-white">
          か
        </span>
      </Grid>
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
