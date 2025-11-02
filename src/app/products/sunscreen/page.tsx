"use client";

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
import { motion } from "framer-motion";

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

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionGrid = motion(Grid);

export default function SunscreenPage() {
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
            gap={6}
            variants={itemVariants}
          >
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
                Daily Sunscreen
              </Heading>
            </Box>

            <Text fontSize="lg" lineHeight="1.7" color="gray.600" _dark={{ color: "gray.200" }}>
              Weightless SPF for real life — no white cast, no stickiness. Protects without a performance.
            </Text>

            <Text fontSize="md" lineHeight="1.6" color="gray.700" _dark={{ color: "gray.300" }}>
              Ordyn Daily Sunscreen is designed to be the world&apos;s most wearable protection — powerful, invisible, and nourishing. Unlike heavy or chalky sunscreens, it hydrates, brightens, and shields your skin from sun and pollution without dulling its glow. It feels like skincare, not sunscreen — made for real, everyday use.
            </Text>

            {/* Real Protection, Beautifully Invisible */}
            <Box mt={4}>
              <Heading
                as="h2"
                fontSize="xl"
                fontWeight="semibold"
                mb={6}
                color="black"
                _dark={{ color: "white" }}
              >
                Real Protection, Beautifully Invisible
              </Heading>
              <MotionVStack
                align="stretch"
                gap={5}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
                variants={containerVariants}
              >
                <MotionBox variants={itemVariants}>
                  <Heading as="h3" fontSize="md" fontWeight="semibold" color="black" _dark={{ color: "white" }} mb={1}>
                    Broad-Spectrum SPF 50 PA+++
                  </Heading>
                  <Text fontSize="sm" lineHeight="1.6" color="gray.600" _dark={{ color: "gray.300" }}>
                    Protects against UVA, UVB, and blue light to prevent tanning, pigmentation, and early aging.
                  </Text>
                </MotionBox>
                <MotionBox variants={itemVariants}>
                  <Heading as="h3" fontSize="md" fontWeight="semibold" color="black" _dark={{ color: "white" }} mb={1}>
                    Niacinamide + Hyaluronic Complex
                  </Heading>
                  <Text fontSize="sm" lineHeight="1.6" color="gray.600" _dark={{ color: "gray.300" }}>
                    Brightens dullness, evens tone, and deeply hydrates for a naturally healthy glow.
                  </Text>
                </MotionBox>
                <MotionBox variants={itemVariants}>
                  <Heading as="h3" fontSize="md" fontWeight="semibold" color="black" _dark={{ color: "white" }} mb={1}>
                    Ceramide & Vitamin E barrier support
                  </Heading>
                  <Text fontSize="sm" lineHeight="1.6" color="gray.600" _dark={{ color: "gray.300" }}>
                    Strengthens the skin&apos;s defense against dryness, stress, and environmental damage.
                  </Text>
                </MotionBox>
                <MotionBox variants={itemVariants}>
                  <Heading as="h3" fontSize="md" fontWeight="semibold" color="black" _dark={{ color: "white" }} mb={1}>
                    Zero white cast formula
                  </Heading>
                  <Text fontSize="sm" lineHeight="1.6" color="gray.600" _dark={{ color: "gray.300" }}>
                    Blends seamlessly with all skin tones, leaving a smooth, satin-matte finish.
                  </Text>
                </MotionBox>
                <MotionBox variants={itemVariants}>
                  <Heading as="h3" fontSize="md" fontWeight="semibold" color="black" _dark={{ color: "white" }} mb={1}>
                    Non-greasy, breathable wear
                  </Heading>
                  <Text fontSize="sm" lineHeight="1.6" color="gray.600" _dark={{ color: "gray.300" }}>
                    Lightweight and invisible — feels like nothing on the skin while protecting all day.
                  </Text>
                </MotionBox>
              </MotionVStack>
            </Box>

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
          </MotionVStack>
        </MotionGrid>
      </Box>
    </Box>
  );
}
