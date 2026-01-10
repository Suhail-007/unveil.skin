"use client";

import { Badge, Box, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import ProductActions from "@/components/products/ProductActions";
import { AnimatedBenefit } from "@/components/products/AnimatedProductGrid";
import { type Product } from "@/lib/services/product.service";
import { useFeatureFlags } from "@/lib/features/FeatureFlagsContext";

interface ProductDetailsProps {
  product: Product;
  displayPrice: number;
  mainImage: string;
}

export default function ProductDetails({ product, displayPrice, mainImage }: ProductDetailsProps) {
  const { flags } = useFeatureFlags();

  return (
    <Stack gap={6}>
      {product.category && (
        <Badge
          alignSelf="flex-start"
          borderRadius="full"
          px={3}
          py={1}
          fontSize="xs"
          fontWeight="medium"
          className="bg-black/10 dark:bg-white/10"
        >
          {product.category}
        </Badge>
      )}

      <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold">
        {product.name}
      </Heading>

      <Text fontSize="md" color="gray.600" _dark={{ color: "gray.300" }}>
        {product.details_description || product.description}
      </Text>

      {flags.showPricing && displayPrice > 0 && (
        <Text fontSize="2xl" fontWeight="bold">
          ₹{displayPrice.toFixed(2)}
        </Text>
      )}

      {flags.enableCart && (
        <ProductActions
          productId={product.id}
          productName={product.name}
          productPrice={displayPrice}
          productImage={mainImage}
        />
      )}

      {flags.showBenefits &&
        product.benefits &&
        Object.keys(product.benefits).filter(([key]) => !key.toLowerCase().startsWith("additional")).length > 0 && (
          <Box borderTop="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }} pt={6}>
            <Heading as="h3" fontSize="lg" fontWeight="semibold" mb={4}>
              Benefits
            </Heading>
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={6}>
              {Object.entries(product.benefits)
                .filter(([key]) => !key.toLowerCase().startsWith("additional"))
                .map(([key, value]) => (
                  <AnimatedBenefit key={key}>
                    <Text fontWeight="semibold" mb={1}>
                      {key}
                    </Text>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                      {value}
                    </Text>
                  </AnimatedBenefit>
                ))}
            </SimpleGrid>
          </Box>
        )}
    </Stack>
  );
}
