import { Box, Heading, HStack } from "@chakra-ui/react";

interface HowToUseCardProps {
  howToUse: Record<string, string | Record<string, string>>;
}

export default function HowToUseCard({ howToUse }: HowToUseCardProps) {
  const filteredEntries = Object.entries(howToUse).filter(
    ([key]) => !key.toLowerCase().startsWith("additional")
  );

  if (filteredEntries.length === 0) return null;

  return (
    <Box p={6} borderRadius="xl" bg="gray.900" _dark={{ bg: "gray.900" }}>
      <HStack gap={3} mb={4}>
        <Box flexShrink={0}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" className="text-blue-500" />
            <path d="M10 6v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-500" />
          </svg>
        </Box>
        <Heading as="h2" fontSize="lg" fontWeight="bold" color="white">
          How to use
        </Heading>
      </HStack>
      <Box
        as="ol"
        pl={5}
        css={{
          listStyleType: "decimal",
          "& li": {
            paddingLeft: "0.5rem",
            marginBottom: "1rem",
            color: "#D1D5DB",
            fontSize: "0.875rem",
          },
          "& li::marker": {
            color: "#9CA3AF",
            fontWeight: "bold",
          },
        }}
      >
        {filteredEntries.map(([step, instruction]) => (
          <li key={step}>{typeof instruction === 'string' ? instruction : JSON.stringify(instruction)}</li>
        ))}
      </Box>
    </Box>
  );
}
