"use client";

import { useState } from "react";
import { Button } from "@chakra-ui/react";
import { useAppSelector } from "@/lib/redux/hooks";
import AuthModal from "../auth/AuthModal";

interface CheckoutButtonProps {
  onCheckout?: () => void;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export default function CheckoutButton({
  onCheckout,
  children = "Proceed to Payment",
  size = "lg",
  disabled = false,
}: CheckoutButtonProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isGuest } = useAppSelector((state) => state.auth);

  const handleClick = () => {
    if (isGuest) {
      // Show auth modal if user is a guest
      setShowAuthModal(true);
    } else {
      // Proceed to checkout if user is authenticated
      if (onCheckout) {
        onCheckout();
      }
    }
  };

  return (
    <>
      <Button
        size={size}
        onClick={handleClick}
        disabled={disabled}
        className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {children}
      </Button>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        allowGuest={false}
      />
    </>
  );
}
