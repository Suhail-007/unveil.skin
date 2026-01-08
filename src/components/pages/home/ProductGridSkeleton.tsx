import { Box, SimpleGrid, Skeleton, Stack } from "@chakra-ui/react";

export default function ProductGridSkeleton() {
  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 10, md: 14 }}>
      {[1, 2].map((i) => (
        <Box
          key={i}
          borderRadius="3xl"
          overflow="hidden"
          className="bg-white/85 dark:bg-zinc-950/80 border border-zinc-200/60 dark:border-zinc-800/60"
        >
          <Skeleton height={{ base: "320px", md: "380px" }} />
          <Stack p={{ base: 6, md: 8 }} gap={3}>
            <Skeleton height="32px" width="70%" />
            <Skeleton height="20px" width="90%" />
            <Skeleton height="20px" width="60%" />
            <Skeleton height="28px" width="100px" mt={2} />
          </Stack>
        </Box>
      ))}
    </SimpleGrid>
  );
}
