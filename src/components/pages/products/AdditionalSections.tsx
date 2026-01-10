import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { Product } from "../../../lib/services";

interface AdditionalSectionsProps {
  benefits?: Product['benefits'];
  howToUse?: Product['how_to_use'];
  dermatologistNotes?: Product['dermatologist_notes'];
}

export default function AdditionalSections({ 
  benefits, 
  howToUse, 
  dermatologistNotes 
}: AdditionalSectionsProps) {
  const additionalSections: Record<string, Record<string, string>> = {};
  
  [benefits, howToUse, dermatologistNotes].forEach(field => {
    if (field) {
      Object.entries(field).forEach(([key, value]) => {
        if (key.toLowerCase().startsWith('additional')) {
          if (typeof value === 'object') {
            additionalSections[key] = value as Record<string, string>;
          }
        }
      });
    }
  });

  if (Object.keys(additionalSections).length === 0) {
    return null;
  }

  return (
    <>
      {Object.entries(additionalSections).map(([sectionKey, sectionData]) => (
        <Box key={sectionKey} mt={12}>
          <Heading as="h2" fontSize="2xl" fontWeight="bold" mb={6}>
            {sectionKey.replace(/additional\d*/i, '').trim() || 'What makes it work'}
          </Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6}>
            {Object.entries(sectionData).map(([title, content]) => (
              <Box key={title}>
                <Text fontWeight="semibold" mb={2}>{title}</Text>
                <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                  {content}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      ))}
    </>
  );
}
