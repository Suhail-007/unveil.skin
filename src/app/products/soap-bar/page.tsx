import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Grid,
} from "@chakra-ui/react";

export const metadata = {
  title: "Ordyn Soap Bar - unveil.skin",
  description: "Gentle, fragrance-light cleanse for everyday skin. No fuss. No film. Just clean.",
};

export default function SoapBarPage() {
  return (
    <Box minH="100vh" bg="white" _dark={{ bg: "black" }}>
      {/* Header */}
      <Box as="header" borderBottom="1px" borderColor="gray.200" _dark={{ borderColor: "gray.800" }}>
        <Container maxW="7xl" px={6} py={6}>
          <Link href="/">
            <VStack align="start" gap={1}>
              <Heading
                as="h1"
                fontSize="2xl"
                fontWeight="bold"
                letterSpacing="tight"
                color="black"
                _dark={{ color: "white" }}
              >
                unveil<Text as="span" color="gray.500" _dark={{ color: "gray.500" }}>
                  .skin
                </Text>
              </Heading>
              <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.200" }}>
                Everyday care, quietly excellent
              </Text>
            </VStack>
          </Link>
        </Container>
      </Box>

      {/* Product Content */}
      <Box as="main" maxW="7xl" mx="auto" px={6} py={{ base: 12, md: 16 }}>
        {/* Back Link */}
        <Link href="/">
          <HStack
            mb={8}
            gap={2}
            color="gray.700"
            _dark={{ color: "gray.300" }}
            _hover={{ color: "black", _dark: { color: "white" } }}
            transition="color 0.2s"
          >
            <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: "inline-block" }}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <Text fontSize="sm">Back to products</Text>
          </HStack>
        </Link>

        {/* Product Grid */}
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap={{ base: 12, lg: 16 }}
        >
          {/* Product Image */}
          <Box
            position="relative"
            aspectRatio={1}
            overflow="hidden"
            borderRadius="lg"
            bg="gray.50"
            _dark={{ bg: "gray.900" }}
          >
            <Image
              src="/Soap_bar.png"
              alt="Ordyn soap bar"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </Box>

          {/* Product Details */}
          <VStack align="stretch" justify="center" gap={6}>
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.600" _dark={{ color: "gray.400" }}>
                ORDYN
              </Text>
              <Heading
                as="h1"
                mt={2}
                fontSize={{ base: "4xl", sm: "5xl" }}
                fontWeight="bold"
                letterSpacing="tight"
                color="black"
                _dark={{ color: "white" }}
              >
                Soap Bar
              </Heading>
            </Box>

            <Text fontSize="lg" lineHeight={8} color="gray.600" _dark={{ color: "gray.200" }}>
              Gentle, fragrance-light cleanse for everyday skin. No fuss. No film. Just clean.
            </Text>

            {/* Features */}
            <VStack align="stretch" gap={4} mb={8}>
              <HStack align="start" gap={3}>
                <Box
                  mt={1.5}
                  h={1.5}
                  w={1.5}
                  borderRadius="full"
                  className="bg-zinc-400 dark:bg-zinc-600"
                />
                <Box>
                  <Heading as="h3" fontSize="md" fontWeight="medium" color="black" _dark={{ color: "white" }}>
                    Gentle formulation
                  </Heading>
                  <Text mt={1} fontSize="sm" color="gray.600" _dark={{ color: "gray.200" }}>
                    Formulated for daily use without stripping your skin&apos;s natural balance.
                  </Text>
                </Box>
              </HStack>
              <HStack align="start" gap={3}>
                <Box
                  mt={1.5}
                  h={1.5}
                  w={1.5}
                  borderRadius="full"
                  className="bg-zinc-400 dark:bg-zinc-600"
                />
                <Box>
                  <Heading as="h3" fontSize="md" fontWeight="medium" color="black" _dark={{ color: "white" }}>
                    Fragrance-light
                  </Heading>
                  <Text mt={1} fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }}>
                    Subtle, natural scent that won&apos;t overwhelm your senses.
                  </Text>
                </Box>
              </HStack>
              <HStack align="start" gap={3}>
                <Box
                  mt={1.5}
                  h={1.5}
                  w={1.5}
                  borderRadius="full"
                  className="bg-zinc-400 dark:bg-zinc-600"
                />
                <Box>
                  <Heading as="h3" fontSize="md" fontWeight="medium" color="black" _dark={{ color: "white" }}>
                    No residue
                  </Heading>
                  <Text mt={1} fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }}>
                    Rinses clean without leaving any film or sticky feeling behind.
                  </Text>
                </Box>
              </HStack>
            </VStack>

            {/* Coming Soon Notice */}
            <Box
              borderRadius="lg"
              border="1px"
              borderColor="gray.200"
              bg="gray.50"
              _dark={{ borderColor: "gray.800", bg: "gray.900" }}
              p={6}
            >
              <HStack gap={2} mb={2}>
                <Box
                  h={2}
                  w={2}
                  borderRadius="full"
                  className="bg-zinc-400 dark:bg-zinc-600 animate-pulse"
                />
                <Text fontSize="sm" fontWeight="medium" color="gray.600" _dark={{ color: "gray.200" }}>
                  Coming soon
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.300" }}>
                We&apos;re putting the finishing touches on ORDYN. Available in a few months.
              </Text>
            </Box>
          </VStack>
        </Grid>
      </Box>
    </Box>
  );
}
