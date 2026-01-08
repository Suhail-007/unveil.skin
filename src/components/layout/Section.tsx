import { Box, BoxProps } from "@chakra-ui/react";

interface SectionProps extends BoxProps {
  children: React.ReactNode;
}

export function Section({ children, ...props }: SectionProps) {
  return (
    <Box mt={{ base: 16, md: 20 }} {...props}>
      {children}
    </Box>
  );
}
