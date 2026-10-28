// Why: a loading placeholder: a few skeleton bars while a screen reads the checkout.
import { Box } from "ink";

import { Skeleton } from "@/components/ui/skeleton";

export function LoadingLines({ lines = 4 }: { lines?: number }) {
  return (
    <Box flexDirection="column" gap={1} paddingX={1}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} width={index % 2 === 0 ? 40 : 28} />
      ))}
    </Box>
  );
}
