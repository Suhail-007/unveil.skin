import { Box, HStack, SimpleGrid, Skeleton, Stack } from "@chakra-ui/react";
import { PageContainer } from "@/components/layout/PageContainer";

export default function ProductPageSkeleton() {
  return (
    <PageContainer size="standard" py={{ base: 12, md: 16 }}>
      {/* Back Link Skeleton */}
      <Skeleton height="24px" width="100px" mb={8} />

      {/* Product Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 12, lg: 16 }}>
        {/* Image Section Skeleton */}
        <Box>
          <Skeleton 
            height={{ base: "400px", md: "500px" }} 
            borderRadius="2xl" 
          />
          <HStack mt={4} gap={4}>
            <Skeleton height="80px" width="80px" borderRadius="xl" />
            <Skeleton height="80px" width="80px" borderRadius="xl" />
          </HStack>
        </Box>

        {/* Details Section Skeleton */}
        <Stack gap={6}>
          {/* Badge */}
          <Skeleton height="28px" width="150px" borderRadius="full" />
          
          {/* Title */}
          <Skeleton height="48px" width="80%" />
          
          {/* Description */}
          <Stack gap={2}>
            <Skeleton height="20px" width="100%" />
            <Skeleton height="20px" width="90%" />
            <Skeleton height="20px" width="95%" />
          </Stack>

          {/* Price */}
          <Skeleton height="36px" width="120px" />

          {/* Actions */}
          <Stack gap={4}>
            <Skeleton height="48px" width="100%" borderRadius="full" />
          </Stack>

          <Box borderTop="1px solid" borderColor="gray.200" pt={6}>
            <Skeleton height="24px" width="150px" mb={4} />
            <Stack gap={3}>
              {[1, 2, 3, 4].map((i) => (
                <Stack key={i} gap={1}>
                  <Skeleton height="20px" width="100px" />
                  <Skeleton height="16px" width="200px" />
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>
      </SimpleGrid>

      {/* Additional Sections Skeleton */}
      <Stack gap={12} mt={16}>
        <Stack gap={4}>
          <Skeleton height="32px" width="200px" />
          <Stack gap={2}>
            <Skeleton height="20px" width="100%" />
            <Skeleton height="20px" width="95%" />
            <Skeleton height="20px" width="90%" />
          </Stack>
        </Stack>
      </Stack>
    </PageContainer>
  );
}
