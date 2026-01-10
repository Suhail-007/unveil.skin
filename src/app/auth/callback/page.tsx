import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container, Heading, Text, VStack } from "@chakra-ui/react";

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const code = params.code as string | undefined;
  const error = params.error as string | undefined;
  const errorDescription = params.error_description as string | undefined;

  // Handle error from Supabase
  if (error) {
    return (
      <Container maxW="md" py={20}>
        <VStack gap={6} align="center">
          <Text fontSize="5xl">✗</Text>
          <Heading size="lg">Verification Failed</Heading>
          <Text color="gray.500" textAlign="center">
            {errorDescription?.replace(/\+/g, ' ') || 'Verification failed'}
          </Text>
        </VStack>
      </Container>
    );
  }

  // Exchange code for session
  if (code) {
    const supabase = await createClient();
    
    // Use the server-side method to handle the code exchange
    // This properly handles PKCE flow with cookies
    await supabase.auth.exchangeCodeForSession(code);

    // After successful exchange, redirect to home
    // The session will be established in cookies
    redirect('/');
  }

  // No code or error - invalid link
  return (
    <Container maxW="md" py={20}>
      <VStack gap={6} align="center">
        <Text fontSize="5xl">✗</Text>
        <Heading size="lg">Invalid Link</Heading>
        <Text color="gray.500" textAlign="center">
          This verification link is invalid or has expired.
        </Text>
      </VStack>
    </Container>
  );
}
