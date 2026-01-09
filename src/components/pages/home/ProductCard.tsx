"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Badge,
  Box,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { type Product } from "@/lib/services/product.service";
import { useFeatureFlags } from "@/lib/features/FeatureFlagsContext";

const MotionBox = motion(Box);

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.6, -0.05, 0.01, 0.99] as const },
  },
};

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { flags } = useFeatureFlags();
  const productUrl = `/products/${product.id}`;
  const ribbonText = product.category || (product.name.toLowerCase().includes('soap') ? 'Clarifying Cleanse' : 'Invisible SPF 50 PA+++');
  
  // Find main image from images object
  const mainImage = product.images 
    ? Object.values(product.images).find(img => img.isMain)?.url || Object.values(product.images)[0]?.url
    : null;

  return (
    <Link href={productUrl} style={{ textDecoration: 'none' }}>
      <MotionBox
        borderRadius="3xl"
        overflow="hidden"
        className="bg-white/85 dark:bg-zinc-950/80 border border-zinc-200/60 dark:border-zinc-800/60"
        variants={itemVariants}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.35 }}
      >
        <Box position="relative" h={{ base: "320px", md: "380px" }}>
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 100vw, 45vw"
              priority={index === 0}
            />
          ) : (
            <Box 
              w="full" 
              h="full" 
              className="bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center"
            >
              <Text className="text-zinc-400">No image</Text>
            </Box>
          )}
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
            {ribbonText}
          </Badge>
        </Box>
        <Stack p={{ base: 6, md: 8 }} gap={3}>
          <Heading as="h3" fontSize={{ base: "2xl", md: "2.5xl" }} fontWeight="semibold" className="text-black dark:text-white">
            {product.name}
          </Heading>
          <Text fontSize="sm" className="text-zinc-600 dark:text-zinc-300">
            {product.description || 'No description available'}
          </Text>
          {flags.showPricing && parseFloat(product.price) > 0 && (
            <Text fontSize="xl" fontWeight="semibold" className="text-black dark:text-white">
              ₹{parseFloat(product.price).toFixed(2)}
            </Text>
          )}
        </Stack>
      </MotionBox>
    </Link>
  );
}
