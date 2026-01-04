"use client";

import { Box, IconButton, Badge } from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/fi";
import { useAppSelector } from "@/lib/redux/hooks";

interface CartIconProps {
  onClick: () => void;
}

export default function CartIcon({ onClick }: CartIconProps) {
  const itemCount = useAppSelector((state) => state.cart.itemCount);

  return (
    <Box position="relative">
      <IconButton
        aria-label="Shopping cart"
        onClick={onClick}
        variant="ghost"
        className="text-zinc-700 dark:text-zinc-300"
      >
        <FiShoppingCart size={20} />
      </IconButton>
      {itemCount > 0 && (
        <Badge
          position="absolute"
          top="-2px"
          right="-2px"
          borderRadius="full"
          px={2}
          py={0.5}
          fontSize="xs"
          className="bg-black text-white dark:bg-white dark:text-black"
        >
          {itemCount}
        </Badge>
      )}
    </Box>
  );
}
