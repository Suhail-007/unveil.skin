"use client";

import { Box, Grid, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] as const },
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

const MotionGrid = motion(Grid);
const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

interface AnimatedProductGridProps {
  children: [ReactNode, ReactNode]; // [image, details]
}

export function AnimatedProductGrid({ children }: AnimatedProductGridProps) {
  return (
    <MotionGrid
      templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
      gap={{ base: 12, lg: 16 }}
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      {children}
    </MotionGrid>
  );
}

interface AnimatedImageProps {
  children: ReactNode;
}

export function AnimatedImage({ children }: AnimatedImageProps) {
  return (
    <MotionBox
      position="relative"
      aspectRatio={1}
      overflow="hidden"
      borderRadius="lg"
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
      variants={itemVariants}
    >
      {children}
    </MotionBox>
  );
}

interface AnimatedDetailsProps {
  children: ReactNode;
}

export function AnimatedDetails({ children }: AnimatedDetailsProps) {
  return (
    <MotionVStack
      align="stretch"
      justify="center"
      gap={8}
      variants={itemVariants}
    >
      {children}
    </MotionVStack>
  );
}

interface AnimatedBenefitProps {
  children: ReactNode;
}

export function AnimatedBenefit({ children }: AnimatedBenefitProps) {
  return (
    <MotionBox variants={itemVariants}>
      {children}
    </MotionBox>
  );
}
