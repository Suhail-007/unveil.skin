"use client";

import Link from "next/link";
import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import SignupForm from "@/components/auth/SignupForm";
import AnimatedBackground from "@/components/auth/AnimatedBackground";

export default function SignupPage() {
  return (
    <Box minH="100vh" position="relative" className="bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-black dark:via-zinc-950 dark:to-zinc-900">
      <AnimatedBackground />
      
      <Container maxW="md" py={20} position="relative" zIndex={1}>
        <Stack gap={8}>
          <Box textAlign="center">
            <Heading
              as="h1"
              fontSize="3xl"
              fontWeight="bold"
              mb={2}
              className="text-black dark:text-white"
            >
              Sign Up
            </Heading>
            <Text className="text-zinc-600 dark:text-zinc-400">
              Create your unveil.skin account
            </Text>
          </Box>

          <Box
            p={8}
            borderRadius="2xl"
            className="bg-white/90 backdrop-blur-xl dark:bg-zinc-950/90 border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl"
          >
            <SignupForm />
          </Box>

          <Text textAlign="center" fontSize="sm" className="text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="text-black dark:text-white font-medium underline-offset-4 hover:underline">
              Log in
            </Link>
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
