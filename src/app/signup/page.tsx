"use client";

import Link from "next/link";
import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <Box minH="100vh" className="bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-black dark:via-zinc-950 dark:to-zinc-900">
      <Container maxW="md" py={20}>
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
            className="bg-white/80 dark:bg-zinc-950/70 border border-zinc-200/60 dark:border-zinc-800/60"
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
