"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Heading,
  HStack,
  Icon,
  Separator,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CheckIcon, InfoOutlineIcon, WarningIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] as const },
  },
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.6, -0.05, 0.01, 0.99] as const },
  },
};

const publicBenefits = [
  {
    title: "Sun Protection",
    copy: "Broad-spectrum SPF 50 PA+++ shields against UV rays.",
  },
  {
    title: "Pigmentation",
    copy: "Helps prevent dark spots and sun-induced discoloration.",
  },
  {
    title: "Tanning",
    copy: "Protects against tanning and maintains even skin tone.",
  },
  {
    title: "Anti-aging",
    copy: "Guards against premature aging and fine lines.",
  },
];

const ingredients = [
  {
    title: "UV filters",
    copy: "Advanced protection against UVA, UVB, and blue light.",
  },
  {
    title: "Niacinamide",
    copy: "Brightens and controls oil.",
  },
  {
    title: "Ceramides",
    copy: "Strengthens skin barrier.",
  },
];

const howToUse = [
  "Apply as the final step of your AM routine on face, ears, and exposed body.",
  "Use two finger-lengths for face and neck. Double the dose for extended areas like arms.",
  "Tap the formula in and spread outward until invisible. Avoid tugging around the eyes.",
  "Reapply every 2-3 hours outdoors, or after sweating/towelling.",
  "Pair with ORDYN Soap Bar in the PM to reset your skin without over-cleansing.",
];

const dermNotes = [
  "For acne-prone skin, layer over a lightweight moisturiser to lock actives in place.",
  "Do not apply on broken skin. Consult your dermatologist if you have photosensitivity disorders.",
  "Sunscreen is only one part of sun protection. Add hats, shade, and sunglasses when possible.",
];

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionGrid = motion(Grid);
const MotionStack = motion(Stack);

export default function SunscreenPage() {
  const [logoSrc, setLogoSrc] = useState("/Logo.svg"); // Default to light mode for SSR
  const resolvedLogoSrc = useColorModeValue("/Logo.svg", "/Logo_Dark.svg");
  
  useEffect(() => {
    // Update logo after hydration to match client theme
    setLogoSrc(resolvedLogoSrc);
  }, [resolvedLogoSrc]);
  
  return (
    <Box minH="100vh" bg="white" _dark={{ bg: "black" }}>
      {/* Header */}
      <Box as="header" borderBottom="1px" borderColor="gray.200" _dark={{ borderColor: "gray.800" }}>
        <Container maxW="7xl" px={6} py={6}>
          <Link href="/">
            <Image
              src={logoSrc}
              alt="unveil.skin"
              width={180}
              height={53}
              priority
              style={{ height: '32px', width: 'auto' }}
              className="h-8 w-auto"
            />
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
        <MotionGrid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap={{ base: 12, lg: 16 }}
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          {/* Product Image */}
          <MotionBox
            position="relative"
            aspectRatio={1}
            overflow="hidden"
            borderRadius="lg"
            bg="gray.50"
            _dark={{ bg: "gray.900" }}
            variants={itemVariants}
          >
            <Image
              src="/Sunscreen.png"
              alt="Ordyn daily sunscreen"
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </MotionBox>

          {/* Product Details */}
          <MotionVStack
            align="stretch"
            justify="center"
            gap={8}
            variants={itemVariants}
          >
            <Stack gap={3}>
              <Badge
                alignSelf="flex-start"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                fontWeight="semibold"
                letterSpacing="wider"
                textTransform="uppercase"
                colorScheme="purple"
              >
                Invisible defense
              </Badge>
              <Stack gap={2}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600" _dark={{ color: "gray.400" }}>
                  ORDYN
                </Text>
                <Heading
                  as="h1"
                  fontSize={{ base: "4xl", sm: "5xl" }}
                  fontWeight="bold"
                  letterSpacing="tight"
                  color="black"
                  _dark={{ color: "white" }}
                >
                  Daily Sunscreen
                </Heading>
              </Stack>
            </Stack>

            <Stack gap={4}>
              <Text fontSize="lg" lineHeight="1.7" color="gray.600" _dark={{ color: "gray.200" }}>
                Serum-light broad-spectrum protection with niacinamide. Zero white cast, breathable finish, perfect under makeup.
              </Text>
            </Stack>

            <Stack gap={4}>
              <Button
                size="lg"
                borderRadius="full"
                px={8}
                h={14}
                fontSize="md"
                fontWeight="semibold"
                className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Buy Now
              </Button>
              <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }} textAlign="center">
                Coming soon
              </Text>
            </Stack>

            <Box>
              <Heading
                as="h2"
                fontSize="xl"
                fontWeight="semibold"
                mb={6}
                color="black"
                _dark={{ color: "white" }}
              >
                Benefits
              </Heading>
              <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
                {publicBenefits.map((benefit) => (
                  <MotionBox key={benefit.title} variants={itemVariants}>
                    <Text fontSize="sm" fontWeight="semibold" color="black" _dark={{ color: "white" }} mb={1}>
                      {benefit.title}
                    </Text>
                    <Text fontSize="xs" lineHeight="1.5" color="gray.600" _dark={{ color: "gray.300" }}>
                      {benefit.copy}
                    </Text>
                  </MotionBox>
                ))}
              </SimpleGrid>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
              <MotionStack
                bg="gray.50"
                borderRadius="xl"
                border="1px"
                borderColor="gray.200"
                _dark={{ bg: "gray.900", borderColor: "gray.800" }}
                p={6}
                gap={5}
                variants={itemVariants}
              >
                <HStack gap={3}>
                  <InfoOutlineIcon color="purple.400" boxSize={5} />
                  <Heading as="h2" fontSize="md" fontWeight="semibold">
                    How to use
                  </Heading>
                </HStack>
                <Stack as="ol" gap={3} m={0} p={0} listStyleType="none">
                  {howToUse.map((step, index) => (
                    <HStack as="li" key={step} align="flex-start" gap={3}>
                      <Badge
                        borderRadius="full"
                        px={2}
                        py={1}
                        fontSize="xs"
                        colorScheme="blackAlpha"
                      >
                        {index + 1}
                      </Badge>
                      <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.200" }}>
                        {step}
                      </Text>
                    </HStack>
                  ))}
                </Stack>
              </MotionStack>

              <MotionStack
                bg="white"
                borderRadius="xl"
                border="1px"
                borderColor="gray.200"
                _dark={{ bg: "gray.950", borderColor: "gray.800" }}
                p={6}
                gap={4}
                variants={itemVariants}
              >
                <HStack gap={3}>
                  <WarningIcon color="red.400" boxSize={5} />
                  <Heading as="h2" fontSize="md" fontWeight="semibold">
                    Dermatologist notes
                  </Heading>
                </HStack>
                <Stack as="ul" gap={3} listStyleType="none" m={0} p={0}>
                  {dermNotes.map((note) => (
                    <HStack as="li" key={note} align="flex-start" gap={3}>
                      <Icon as={CheckIcon} color="#c88d8d" mt={1} boxSize={4} />
                      <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.200" }}>
                        {note}
                      </Text>
                    </HStack>
                  ))}
                </Stack>
                <Separator borderColor="gray.200" _dark={{ borderColor: "gray.800" }} />
                <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                  Mineral and organic filters combined. Cosmetic preparation; not a treatment for sunburn. Reapply diligently for continued protection.
                </Text>
              </MotionStack>
            </SimpleGrid>

            <Box mt={8}>
              <Heading
                as="h2"
                fontSize="lg"
                fontWeight="semibold"
                mb={4}
                color="black"
                _dark={{ color: "white" }}
              >
                What makes it work
              </Heading>
              <Stack gap={3}>
                {ingredients.map((ingredient) => (
                  <Box key={ingredient.title}>
                    <Text fontSize="sm" fontWeight="medium" color="black" _dark={{ color: "white" }} mb={1}>
                      {ingredient.title}
                    </Text>
                    <Text fontSize="xs" lineHeight="1.5" color="gray.600" _dark={{ color: "gray.300" }}>
                      {ingredient.copy}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box mt={8} pt={6} borderTop="1px" borderColor="gray.200" _dark={{ borderColor: "gray.800" }}>
              <Text fontSize="xs" fontWeight="semibold" letterSpacing="widest" textTransform="uppercase" color="gray.500" _dark={{ color: "gray.400" }} mb={2}>
                Manufactured by
              </Text>
              <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.300" }}>
                XYXX Cosmo
                <br />Noida Industrial Area, Uttar Pradesh
              </Text>
            </Box>
          </MotionVStack>
        </MotionGrid>
      </Box>
    </Box>
  );
}
