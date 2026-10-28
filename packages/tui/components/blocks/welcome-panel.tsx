// Why: the command-center greeting: product name and the current workspace.
import { Box, Text } from "ink";

import { BigText } from "@/components/ui/big-text";
import { useTheme } from "@/hooks/use-theme";

export function WelcomePanel({ workspace }: { workspace: string }) {
  const theme = useTheme();
  return (
    <Box flexDirection="column" paddingX={1}>
      <BigText font="simple" color={theme.colors.primary}>
        CODEPENDENT
      </BigText>
      <Text>
        Workspace: <Text bold>{workspace.toUpperCase()}</Text>
      </Text>
      <Text color={theme.colors.mutedForeground}>
        Doctrine, modules and workflows arrive in the next steps.
      </Text>
    </Box>
  );
}
