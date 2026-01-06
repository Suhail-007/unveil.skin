import { Box, Grid, HStack, SimpleGrid, Skeleton, Stack, VStack } from "@chakra-ui/react";
import { PageContainer } from "@/components/layout/PageContainer";

export default function SunscreenLoading() {
  return (
    <PageContainer size="standard" py={{ base: 12, md: 16 }}>
      {/* Back Link Skeleton */}
      <HStack mb={8} gap={2}>
        <Skeleton height="16px" width="16px" borderRadius="md" />
        <Skeleton height="14px" width="120px" />
      </HStack>

      {/* Product Grid */}
      <Grid
        templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
        gap={{ base: 12, lg: 16 }}
      >
        {/* Product Image Skeleton */}
        <Box
          position="relative"
          aspectRatio={1}
          overflow="hidden"
          borderRadius="lg"
          bg="gray.50"
          _dark={{ bg: "gray.900" }}
        >
          <Skeleton height="100%" width="100%" />
        </Box>

        {/* Product Details Skeleton */}
        <VStack align="stretch" justify="center" gap={8}>
          {/* Badge and Title */}
          <Stack gap={3}>
            <Skeleton height="24px" width="140px" borderRadius="full" />
            <Stack gap={2}>
              <Skeleton height="14px" width="60px" />
              <Skeleton height="48px" width="240px" />
            </Stack>
          </Stack>

          {/* Description */}
          <Stack gap={2}>
            <Skeleton height="20px" width="100%" />
            <Skeleton height="20px" width="90%" />
          </Stack>

          {/* Buttons */}
          <HStack gap={3}>
            <Skeleton height="56px" flex={1} borderRadius="full" />
            <Skeleton height="56px" flex={1} borderRadius="full" />
          </HStack>

          {/* Benefits */}
          <Box>
            <Skeleton height="24px" width="100px" mb={6} />
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
              {[1, 2, 3, 4].map((i) => (
                <Box key={i}>
                  <Skeleton height="16px" width="80px" mb={1} />
                  <Skeleton height="14px" width="100%" />
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* How to Use & Notes */}
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
            <Stack
              bg="gray.50"
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
              _dark={{ bg: "gray.900", borderColor: "gray.800" }}
              p={6}
              gap={5}
            >
              <Skeleton height="20px" width="120px" />
              <Stack gap={3}>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height="16px" width="100%" />
                ))}
              </Stack>
            </Stack>

            <Stack
              bg="white"
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
              _dark={{ bg: "gray.950", borderColor: "gray.800" }}
              p={6}
              gap={4}
            >
              <Skeleton height="20px" width="160px" />
              <Stack gap={3}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} height="16px" width="100%" />
                ))}
              </Stack>
            </Stack>
          </SimpleGrid>

          {/* Ingredients */}
          <Box mt={8}>
            <Skeleton height="20px" width="140px" mb={4} />
            <Stack gap={3}>
              {[1, 2, 3].map((i) => (
                <Box key={i}>
                  <Skeleton height="16px" width="120px" mb={1} />
                  <Skeleton height="14px" width="90%" />
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Manufacturer */}
          <Box mt={8} pt={6} borderTop="1px" borderColor="gray.200" _dark={{ borderColor: "gray.800" }}>
            <Skeleton height="12px" width="140px" mb={2} />
            <Skeleton height="16px" width="200px" />
          </Box>
        </VStack>
      </Grid>
    </PageContainer>
  );
}
