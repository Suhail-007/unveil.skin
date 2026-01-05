"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Container, Heading, Text, VStack, Spinner, Button } from "@chakra-ui/react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      // Check for error parameters first
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (error) {
        setStatus('error');
        setErrorMessage(errorDescription?.replace(/\+/g, ' ') || 'Verification failed');
        return;
      }

      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');

      if (token_hash && type) {
        const supabase = createClient();

        const { error: verifyError } = await supabase.auth.verifyOtp({
          type: (type || "info") as "info" | "success" | "error" | "warning" | "loading",
          token_hash,
        });

        if (!verifyError) {
          setStatus('success');
          // Redirect to home after showing success
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          setStatus('error');
          setErrorMessage(verifyError.message || 'Verification failed');
        }
      } else {
        setStatus('error');
        setErrorMessage('Invalid verification link');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <Container maxW="md" py={20}>
      <VStack gap={6} align="center">
        {status === 'loading' && (
          <>
            <Spinner size="xl" />
            <Heading size="lg">Verifying your email...</Heading>
            <Text color="gray.500">Please wait while we confirm your account.</Text>
          </>
        )}

        {status === 'success' && (
          <>
            <Text fontSize="5xl">✓</Text>
            <Heading size="lg">Email Verified!</Heading>
            <Text color="gray.500">Your account has been successfully verified.</Text>
            <Text fontSize="sm" color="gray.400">Redirecting you to home...</Text>
          </>
        )}

        {status === 'error' && (
          <>
            <Text fontSize="5xl">✗</Text>
            <Heading size="lg">Verification Failed</Heading>
            <Text color="gray.500" textAlign="center">
              {errorMessage || 'An error occurred during verification.'}
            </Text>
            {errorMessage.includes('expired') && (
              <Text fontSize="sm" color="gray.400" textAlign="center">
                Please try signing up again or request a new verification email.
              </Text>
            )}
            <Button asChild colorPalette="blue">
              <Link href="/signup">Sign Up Again</Link>
            </Button>
          </>
        )}
      </VStack>
    </Container>
  );
}
