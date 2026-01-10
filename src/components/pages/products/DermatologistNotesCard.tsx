import { Box, Heading, HStack, Stack, Text } from "@chakra-ui/react";

interface DermatologistNotesCardProps {
  dermatologistNotes: Record<string, string | Record<string, string>>;
}

export default function DermatologistNotesCard({ dermatologistNotes }: DermatologistNotesCardProps) {
  const filteredEntries = Object.entries(dermatologistNotes).filter(
    ([key]) => !key.toLowerCase().startsWith("additional")
  );

  if (filteredEntries.length === 0) return null;

  return (
    <Box p={6} borderRadius="xl" bg="gray.900" _dark={{ bg: "gray.900" }}>
      <HStack gap={3} mb={4}>
        <Box flexShrink={0}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" className="text-red-500" />
            <path d="M10 6v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-red-500" />
          </svg>
        </Box>
        <Heading as="h2" fontSize="lg" fontWeight="bold" color="white">
          Dermatologist notes
        </Heading>
      </HStack>
      <Stack gap={3}>
        {filteredEntries.map(([title, note]) => {
          // Check if value is an object (additional details)
          if (typeof note === "object" && note !== null) {
            return Object.entries(note as Record<string, string>).map(([subKey, subValue]) => (
              <HStack key={`${title}-${subKey}`} align="start" gap={3}>
                <Box flexShrink={0} mt={0.5}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-green-500">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                  </svg>
                </Box>
                <Text fontSize="sm" color="gray.300">
                  {subValue}
                </Text>
              </HStack>
            ));
          }
          return (
            <HStack key={title} align="start" gap={3}>
              <Box flexShrink={0} mt={0.5}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-green-500">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
                </svg>
              </Box>
              <Text fontSize="sm" color="gray.300">
                {note}
              </Text>
            </HStack>
          );
        })}
      </Stack>
      <Text fontSize="xs" mt={4} color="gray.500">
        Cosmetic product. Reapply for continued protection.
      </Text>
    </Box>
  );
}
