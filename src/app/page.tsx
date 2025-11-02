"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Grid,
  Stack,
  HStack,
  VStack,
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
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] as const },
  },
};

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

export default function Home() {
  return (
    <Box minH="100vh" className="bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-black dark:via-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <Box as="header" borderBottom="1px" className="border-zinc-200 dark:border-zinc-800">
        <Container maxW="7xl" px={6} py={6}>
          <Heading
            as="h1"
            fontSize="2xl"
            fontWeight="bold"
            letterSpacing="tight"
            className="text-black dark:text-white"
          >
            unveil<Text as="span" className="text-zinc-400 dark:text-zinc-600">
              .skin
            </Text>
          </Heading>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box as="main" maxW="7xl" mx="auto" px={6} py={{ base: 16, md: 24 }}>
        {/* Brand intro */}
        <MotionStack
          mb={16}
          align="center"
          textAlign="center"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <Heading
            as="h2"
            fontSize={{ base: "4xl", sm: "6xl" }}
            fontWeight="bold"
            letterSpacing="tight"
            className="text-black dark:text-white"
          >
            Everyday care, quietly excellent
          </Heading>
          <Text
            maxW="2xl"
            mt={4}
            fontSize="lg"
            lineHeight="1.7"
            className="text-zinc-600 dark:text-zinc-400"
          >
            unveil<Text as="span" className="text-zinc-400">.skin</Text> crafts daily essentials
            that feel kind, look timeless, and work beautifully. ORDYN is our first
            line — a simple soap bar and a daily sunscreen.
          </Text>
          <HStack mt={6} justify="center">
            <Link href="#products">
              <Button
                variant="outline"
                borderRadius="full"
                className="border-zinc-300 text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
              >
                Explore Ordyn
              </Button>
            </Link>
          </HStack>
        </MotionStack>

        {/* Philosophy Section */}
        <MotionBox
          mb={20}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <Stack maxW="3xl" mx="auto" align="center" textAlign="center" gap={6}>
            <Heading
              as="h2"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="semibold"
              className="text-black dark:text-white"
            >
              Philosophy
            </Heading>
            <Text
              maxW="2xl"
              fontSize={{ base: "lg", md: "xl" }}
              lineHeight="1.7"
              fontStyle="italic"
              className="text-zinc-700 dark:text-zinc-300"
            >
              We believe the extraordinary hides in the ordinary. At Unveil, we design honest essentials that work quietly but beautifully.
            </Text>
          </Stack>
        </MotionBox>

        {/* Product Preview */}
        <Box id="products" mb={20}>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={{ base: 12, md: 16 }}
          >
            {/* Soap Bar */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/products/soap-bar">
                <Box
                  role="group"
                  position="relative"
                  overflow="hidden"
                  borderRadius="lg"
                  className="bg-zinc-100 dark:bg-zinc-900 transition-transform hover:scale-[1.02] cursor-pointer"
                >
            <Box
              position="relative"
              aspectRatio={1}
              overflow="hidden"
              _groupHover={{
                "& img": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Image
                src="/Soap_bar.png"
                alt="Ordyn soap bar"
                fill
                style={{ objectFit: "cover", transition: "transform 0.7s" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </Box>
            <Box p={5}>
              <Heading as="h3" fontSize="xl" fontWeight="semibold" className="text-black dark:text-white">
                Ordyn Soap Bar
              </Heading>
              <Text mt={2} fontSize="sm" lineHeight="1.6" className="text-zinc-600 dark:text-zinc-400">
                Gentle, fragrance-light cleanse for everyday skin. No fuss. No film.
                Just clean.
              </Text>
            </Box>
          </Box>
              </Link>
            </MotionBox>

            {/* Sunscreen */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/products/sunscreen">
                <Box
                  role="group"
                  position="relative"
                  overflow="hidden"
                  borderRadius="lg"
                  className="bg-zinc-100 dark:bg-zinc-900 transition-transform hover:scale-[1.02] cursor-pointer"
                >
            <Box
              position="relative"
              aspectRatio={1}
              overflow="hidden"
              _groupHover={{
                "& img": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Image
                src="/Sunscreen.png"
                alt="Ordyn daily sunscreen"
                fill
                style={{ objectFit: "cover", transition: "transform 0.7s" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </Box>
            <Box p={5}>
              <Heading as="h3" fontSize="xl" fontWeight="semibold" className="text-black dark:text-white">
                Ordyn Daily Sunscreen
              </Heading>
              <Text mt={2} fontSize="sm" lineHeight="1.6" className="text-zinc-600 dark:text-zinc-400">
                Weightless SPF for real life — no white cast, no stickiness.
                Protects without a performance.
              </Text>
            </Box>
          </Box>
              </Link>
            </MotionBox>
          </Grid>
        </Box>

        {/* Coming Soon Footer */}
        <MotionBox
          borderTop="1px"
          className="border-zinc-200 dark:border-zinc-800"
          pt={12}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <VStack gap={4} align="center" textAlign="center">
            <HStack gap={2} fontSize="sm" className="text-zinc-400 dark:text-zinc-600">
              <Box
                h={2}
                w={2}
                borderRadius="full"
                className="bg-zinc-400 dark:bg-zinc-600 animate-pulse"
              />
              <Text>Coming soon</Text>
            </HStack>
            <Text maxW="md" fontSize="sm" className="text-zinc-500 dark:text-zinc-400">
              Gentle face wash & moisturizer
            </Text>
          </VStack>
        </MotionBox>
      </Box>
    </Box>
  );
}
