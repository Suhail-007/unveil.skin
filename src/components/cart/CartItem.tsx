"use client";

import { Box, IconButton, Stack, Text } from "@chakra-ui/react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import type { CartItem as CartItemType } from "@/lib/redux/slices/cartSlice";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <Box
      p={4}
      borderRadius="lg"
      className="bg-zinc-50 dark:bg-zinc-900/50"
    >
      <Stack direction="row" gap={4} align="start">
        {item.image && (
          <Box
            w="80px"
            h="80px"
            borderRadius="md"
            overflow="hidden"
            flexShrink={0}
            className="bg-zinc-100 dark:bg-zinc-800"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </Box>
        )}

        <Stack flex={1} gap={2}>
          <Text fontWeight="medium" className="text-black dark:text-white">
            {item.name}
          </Text>
          <Text fontSize="sm" fontWeight="semibold" className="text-zinc-600 dark:text-zinc-400">
            ₹{item.price.toFixed(2)}
          </Text>

          <Stack direction="row" justify="space-between" mt={2}>
            <Stack direction="row" gap={2}>
              <IconButton
                size="sm"
                onClick={handleDecrement}
                disabled={item.quantity <= 1}
                aria-label="Decrease quantity"
                variant="outline"
                className="border-zinc-200 dark:border-zinc-800"
              >
                <FiMinus size={14} />
              </IconButton>
              <Text fontSize="sm" fontWeight="medium" minW="20px" textAlign="center">
                {item.quantity}
              </Text>
              <IconButton
                size="sm"
                onClick={handleIncrement}
                aria-label="Increase quantity"
                variant="outline"
                className="border-zinc-200 dark:border-zinc-800"
              >
                <FiPlus size={14} />
              </IconButton>
            </Stack>

            <IconButton
              size="sm"
              onClick={() => onRemove(item.id)}
              aria-label="Remove item"
              variant="ghost"
              className="text-red-600 dark:text-red-400"
            >
              <FiTrash2 size={16} />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
