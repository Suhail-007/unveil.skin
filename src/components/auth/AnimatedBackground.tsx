"use client";

import { Box } from "@chakra-ui/react";

export default function AnimatedBackground() {
  return (
    <Box
      position="absolute"
      inset={0}
      overflow="hidden"
      pointerEvents="none"
      opacity={0.4}
    >
      {/* Dot pattern */}
      <Box
        position="absolute"
        inset={0}
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(200, 141, 141, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
        className="dark:opacity-50"
      />
      
      {/* Animated gradient orbs */}
      <Box
        position="absolute"
        top="-20%"
        right="-10%"
        w="500px"
        h="500px"
        borderRadius="full"
        bg="rgba(200, 141, 141, 0.1)"
        filter="blur(80px)"
        animation="float 20s ease-in-out infinite"
      />
      
      <Box
        position="absolute"
        bottom="-20%"
        left="-10%"
        w="400px"
        h="400px"
        borderRadius="full"
        bg="rgba(200, 141, 141, 0.08)"
        filter="blur(80px)"
        animation="float 15s ease-in-out infinite reverse"
      />
      
      <Box
        position="absolute"
        top="40%"
        left="50%"
        w="300px"
        h="300px"
        borderRadius="full"
        bg="rgba(200, 141, 141, 0.06)"
        filter="blur(60px)"
        animation="pulse 10s ease-in-out infinite"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      />
    </Box>
  );
}
