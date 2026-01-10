"use client";

import { Button, HStack, Stack, Text } from "@chakra-ui/react";
import AddToCartButton from "./AddToCartButton";

interface ProductActionsProps {
  productId: string;
  productName: string;
  productPrice?: number;
  productImage?: string;
  isComingSoon?: boolean;
}

export default function ProductActions({ 
  productId, 
  productName, 
  productPrice = 0,
  productImage,
  isComingSoon = true 
}: ProductActionsProps) {
  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    console.log("Buy now:", productName);
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", productName);
  };

  return (
    <Stack gap={3}>
      <HStack gap={3}>
        <Button
          size="lg"
          borderRadius="full"
          px={8}
          h={14}
          fontSize="md"
          fontWeight="semibold"
          flex={1}
          className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          onClick={handleBuyNow}
          disabled={isComingSoon}
        >
          Buy Now
        </Button>
        <div className="flex-1">
          <AddToCartButton 
            productId={productId}
            productName={productName}
            productPrice={productPrice}
            productImage={productImage}
            onAddToCart={handleAddToCart}
          />
        </div>
      </HStack>
      {isComingSoon && (
        <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }} textAlign="center">
          Coming soon
        </Text>
      )}
    </Stack>
  );
}
