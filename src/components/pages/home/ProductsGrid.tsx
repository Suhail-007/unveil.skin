"use client";

import { SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const MotionBox = motion.div;

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
    },
  },
};

interface ProductsGridProps {
  children: ReactNode;
}

export default function ProductsGrid({ children }: ProductsGridProps) {
  return (
    <MotionBox
      id="products"
      style={{ marginTop: 'var(--chakra-space-20)' }}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-120px" }}
      variants={containerVariants}
    >
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={{ base: 10, md: 14 }}>
        {children}
      </SimpleGrid>
    </MotionBox>
  );
}
