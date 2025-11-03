"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Separator,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useColorModeValue } from "@/components/ui/color-mode";
import WaitlistForm from "@/components/WaitlistForm";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
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
      staggerChildren: 0.18,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.6, -0.05, 0.01, 0.99] as const },
  },
};

const floatInPlace = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const },
  },
};

const productCards = [
  {
    name: "Ordyn Soap Bar",
    slug: "/products/soap-bar",
    image: "/Soap_bar.png",
    alt: "Ordyn soap bar",
    ribbon: "Clarifying Cleanse",
    description: "A gentle, low-foam cleanser with amino-acid surfactants.",
  },
  {
    name: "Ordyn Daily Sunscreen",
    slug: "/products/sunscreen",
    image: "/Sunscreen.png",
    alt: "Ordyn daily sunscreen",
    ribbon: "Invisible SPF 50 PA+++",
    description: "Serum-light broad-spectrum protection with niacinamide.",
  },
];

const MotionBox = motion(Box);
const MotionStack = motion(Stack);
const MotionSimpleGrid = motion(SimpleGrid);

export default function Home() {
  const [logoSrc, setLogoSrc] = useState("/Logo.svg"); // Default to light mode for SSR
  const resolvedLogoSrc = useColorModeValue("/Logo.svg", "/Logo_Dark.svg");
  
  useEffect(() => {
    // Update logo after hydration to match client theme
    setLogoSrc(resolvedLogoSrc);
  }, [resolvedLogoSrc]);
  
  return (
    <Box minH="100vh" className="bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-black dark:via-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <Box as="header" borderBottom="1px" className="border-zinc-200 dark:border-zinc-800">
        <Container maxW="7xl" px={{ base: 4, md: 6 }} py={6}>
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

      {/* Hero Section */}
      <Box as="main" maxW="7xl" mx="auto" px={{ base: 4, md: 6 }} py={{ base: 12, md: 20 }}>
        <MotionBox
          position="relative"
          borderRadius="3xl"
          overflow="hidden"
          px={{ base: 6, md: 12 }}
          py={{ base: 10, md: 16 }}
          className="bg-white/80 backdrop-blur-xl shadow-[0_40px_120px_-60px] shadow-zinc-400/40 dark:bg-zinc-950/70 dark:shadow-[0_40px_120px_-60px] dark:shadow-black"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <Box
            position="absolute"
            inset={0}
            opacity={0.08}
            zIndex={0}
          >
            <Image
              src="/assets/product-bg.jpg"
              alt=""
              fill
              style={{ objectFit: "cover" }}
              sizes="100vw"
            />
          </Box>
          <Box
            position="absolute"
            inset={0}
            pointerEvents="none"
            opacity={0.6}
            style={{ background: 'radial-gradient(circle at top, rgba(200, 141, 141, 0.15), transparent 55%)' }}
            className="dark:bg-[radial-gradient(circle_at_top,_rgba(200,141,141,0.18),_transparent_60%)]"
            zIndex={0}
          />
          <MotionBox
            position="absolute"
            top={-24}
            right={{ base: -10, md: -24 }}
            w={{ base: "48", md: "64" }}
            h={{ base: "48", md: "64" }}
            borderRadius="full"
            style={{ backgroundColor: 'rgba(200, 141, 141, 0.1)' }}
            className="dark:bg-[rgba(200,141,141,0.15)]"
            filter="blur(60px)"
            variants={floatInPlace}
            animate="animate"
          />

          <MotionStack
            position="relative"
            zIndex={1}
            alignItems="center"
            maxW="2xl"
            mx="auto"
          >
            <MotionStack gap={{ base: 6, md: 8 }} variants={containerVariants}>
              <MotionStack gap={{ base: 3, md: 4 }} variants={itemVariants}>
                <Badge
                  alignSelf="flex-start"
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize="xs"
                  fontWeight="semibold"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  style={{ backgroundColor: 'rgba(200, 141, 141, 0.15)', color: '#c88d8d' }}
                  className="dark:bg-[rgba(200,141,141,0.2)] dark:text-[#c88d8d]"
                >
                  Ordyn by unveil.skin
                </Badge>
                <Heading
                  as="h2"
                  fontSize={{ base: "3.5xl", sm: "4xl", md: "5xl" }}
                  lineHeight="1.1"
                  fontWeight="bold"
                  letterSpacing="tight"
                  className="text-black dark:text-white"
                >
                  Unveil Your Real Skin
                </Heading>
              </MotionStack>

              <MotionStack gap={6} variants={itemVariants}>
                <Link href="#products">
                  <Button
                    borderRadius="full"
                    px={8}
                    h={12}
                    className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Explore Ordyn
                  </Button>
                </Link>
              </MotionStack>
            </MotionStack>

          </MotionStack>
        </MotionBox>

        {/* Product Section */}
        <MotionBox
          id="products"
          mt={{ base: 20, md: 28 }}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-120px" }}
          variants={containerVariants}
        >
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 10, md: 14 }}>
            {productCards.map((product, index) => (
              <Link href={product.slug} style={{ textDecoration: 'none' }}>
                <MotionBox
                  key={product.name}
                  borderRadius="3xl"
                  overflow="hidden"
                  className="bg-white/85 dark:bg-zinc-950/80 border border-zinc-200/60 dark:border-zinc-800/60"
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <Box position="relative" h={{ base: "320px", md: "380px" }}>
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 45vw"
                      priority={index === 0}
                    />
                    <Badge
                      position="absolute"
                      top={5}
                      left={5}
                      borderRadius="full"
                      px={3}
                      py={1}
                      fontSize="xs"
                      fontWeight="medium"
                      className="bg-black/80 text-white"
                    >
                      {product.ribbon}
                    </Badge>
                  </Box>
                  <Stack p={{ base: 6, md: 8 }} gap={3}>
                    <Heading as="h3" fontSize={{ base: "2xl", md: "2.5xl" }} fontWeight="semibold" className="text-black dark:text-white">
                      {product.name}
                    </Heading>
                    <Text fontSize="sm" className="text-zinc-600 dark:text-zinc-300">
                      {product.description}
                    </Text>
                  </Stack>
                </MotionBox>
              </Link>
            ))}
          </SimpleGrid>
        </MotionBox>

        {/* Waitlist Section */}
        <MotionBox
          mt={{ base: 20, md: 28 }}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-120px" }}
          variants={fadeInUp}
        >
          <Stack gap={4} align="center" textAlign="center" maxW="md" mx="auto">
            <Text fontSize="sm" className="text-zinc-600 dark:text-zinc-400">
              Get notified when we launch
            </Text>
            <WaitlistForm />
          </Stack>
        </MotionBox>
      </Box>

      {/* Footer */}
      <MotionBox as="footer" borderTop="1px" className="border-zinc-200 dark:border-zinc-800" py={{ base: 10, md: 14 }}>
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={{ base: 8, md: 10 }} mb={{ base: 8, md: 10 }}>
            <Stack gap={4}>
              <Image
                src={logoSrc}
                alt="unveil.skin"
                width={180}
                height={53}
                style={{ height: '24px', width: 'auto' }}
                className="h-6 w-auto"
              />
              <Text fontSize="sm" className="text-zinc-600 dark:text-zinc-400">
                Formulated and crafted in India. Dermatologist-guided, clinically vetted, and mindful of the planet.
              </Text>
            </Stack>
            <Stack gap={4}>
              <Text fontSize="xs" fontWeight="semibold" letterSpacing="widest" textTransform="uppercase" className="text-zinc-500 dark:text-zinc-400">
                Marketed by
              </Text>
              <Text fontSize="sm" className="text-zinc-700 dark:text-zinc-300">
                Unveil Skin
                <br />New Delhi, India
              </Text>
            </Stack>
            <Stack gap={4}>
              <Text fontSize="xs" fontWeight="semibold" letterSpacing="widest" textTransform="uppercase" className="text-zinc-500 dark:text-zinc-400">
                Contact
              </Text>
              <HStack gap={3}>
                <EmailIcon boxSize={4} />
                <Link href="mailto:queries@unveil.skin">
                  <Text fontSize="sm" className="text-zinc-700 dark:text-zinc-300 underline-offset-4 hover:underline">
                    queries@unveil.skin
                  </Text>
                </Link>
              </HStack>

              <Text fontSize="xs" fontWeight="semibold" letterSpacing="widest" textTransform="uppercase" className="text-zinc-500 dark:text-zinc-400" mt={4}>
                Policies
              </Text>
              <Stack gap={2}>
                <Link href="/policies/privacy">
                  <Text fontSize="sm" className="text-zinc-700 dark:text-zinc-300 underline-offset-4 hover:underline">
                    Privacy Policy
                  </Text>
                </Link>
                <Link href="/policies/terms">
                  <Text fontSize="sm" className="text-zinc-700 dark:text-zinc-300 underline-offset-4 hover:underline">
                    Terms & Conditions
                  </Text>
                </Link>
                <Link href="/policies/refund">
                  <Text fontSize="sm" className="text-zinc-700 dark:text-zinc-300 underline-offset-4 hover:underline">
                    Refund Policy
                  </Text>
                </Link>
                <Link href="/policies/shipping">
                  <Text fontSize="sm" className="text-zinc-700 dark:text-zinc-300 underline-offset-4 hover:underline">
                    Shipping Policy
                  </Text>
                </Link>
              </Stack>
            </Stack>
            <Stack gap={4}>
              <Text fontSize="xs" fontWeight="semibold" letterSpacing="widest" textTransform="uppercase" className="text-zinc-500 dark:text-zinc-400">
                We Accept
              </Text>
              <HStack gap={2} flexWrap="wrap">
                <Box
                  px={3}
                  py={1.5}
                  borderRadius="md"
                  className="bg-zinc-100 dark:bg-zinc-800"
                  fontSize="xs"
                  fontWeight="semibold"
                  color="zinc.700"
                  _dark={{ color: "zinc.300" }}
                >
                  UPI
                </Box>
                <Box
                  px={3}
                  py={1.5}
                  borderRadius="md"
                  className="bg-zinc-100 dark:bg-zinc-800"
                  fontSize="xs"
                  fontWeight="semibold"
                  color="zinc.700"
                  _dark={{ color: "zinc.300" }}
                >
                  RuPay
                </Box>
                <Box
                  px={3}
                  py={1.5}
                  borderRadius="md"
                  className="bg-zinc-100 dark:bg-zinc-800"
                  fontSize="xs"
                  fontWeight="semibold"
                  color="zinc.700"
                  _dark={{ color: "zinc.300" }}
                >
                  Visa
                </Box>
                <Box
                  px={3}
                  py={1.5}
                  borderRadius="md"
                  className="bg-zinc-100 dark:bg-zinc-800"
                  fontSize="xs"
                  fontWeight="semibold"
                  color="zinc.700"
                  _dark={{ color: "zinc.300" }}
                >
                  Mastercard
                </Box>
              </HStack>
            </Stack>
          </SimpleGrid>
          <Separator my={{ base: 8, md: 10 }} borderColor="gray.200" _dark={{ borderColor: "gray.800" }} />
          <Stack direction={{ base: "column", md: "row" }} justify="space-between" gap={4}>
            <Text fontSize="xs" className="text-zinc-500 dark:text-zinc-500">
              ? {new Date().getFullYear()} Unveil Skin. All rights reserved.
            </Text>
            <Text fontSize="xs" className="text-zinc-400 dark:text-zinc-500">
              *Products are cosmetic formulations. Not a substitute for medical advice.
            </Text>
          </Stack>
        </Container>
      </MotionBox>
    </Box>
  );
}
