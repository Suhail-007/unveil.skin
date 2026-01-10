"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Box } from "@chakra-ui/react";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  productName: string;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function ImageLightbox({
  images,
  currentIndex,
  productName,
  onClose,
  onNext,
  onPrevious,
}: ImageLightboxProps) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onPrevious();
      } else if (e.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrevious]);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.900"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
      onClick={onClose}
    >
      {/* Close Button */}
      <Box
        position="absolute"
        top={4}
        right={4}
        cursor="pointer"
        p={2}
        borderRadius="md"
        bg="blackAlpha.600"
        _hover={{ bg: "blackAlpha.800" }}
        onClick={onClose}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </Box>

      {/* Previous Button */}
      {images.length > 1 && (
        <Box
          position="absolute"
          left={4}
          cursor="pointer"
          p={2}
          borderRadius="md"
          bg="blackAlpha.600"
          _hover={{ bg: "blackAlpha.800" }}
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Box>
      )}

      {/* Image Container */}
      <Box
        position="relative"
        maxW="90vw"
        maxH="90vh"
        width="100%"
        height="100%"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex]}
          alt={`${productName} - Full view`}
          fill
          style={{ objectFit: "contain" }}
          sizes="90vw"
        />
      </Box>

      {/* Next Button */}
      {images.length > 1 && (
        <Box
          position="absolute"
          right={4}
          cursor="pointer"
          p={2}
          borderRadius="md"
          bg="blackAlpha.600"
          _hover={{ bg: "blackAlpha.800" }}
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Box>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <Box
          position="absolute"
          bottom={4}
          left="50%"
          transform="translateX(-50%)"
          px={4}
          py={2}
          borderRadius="full"
          bg="blackAlpha.700"
          color="white"
          fontSize="sm"
          fontWeight="medium"
        >
          {currentIndex + 1} / {images.length}
        </Box>
      )}
    </Box>
  );
}
