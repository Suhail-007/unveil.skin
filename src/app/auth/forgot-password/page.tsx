import Link from "next/link";
import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import AnimatedBackground from "@/components/auth/AnimatedBackground";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
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
              Forgot Password
            </Heading>
            <Text className="text-zinc-600 dark:text-zinc-400">
              Enter your email to reset your password
        type: "success",
      });
    } catch (err) {
      toaster.create({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to send reset email",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
              Forgot Password
            </Heading>
            <Text className="text-zinc-600 dark:text-zinc-400">
              {submitted 
                ? "Check your email for reset instructions"
                : "Enter your email to receive a password reset link"}
            </Text>
          </Box>

          <Box
            p={8}
            borderRadius="2xl"
            className="bg-white/90 backdrop-blur-xl dark:bg-zinc-950/90 border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl"
          >
            {submitted ? (
              <Stack gap={4} textAlign="center">
                <Box
                  w={12}
                  h={12}
                  mx="auto"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  className="bg-green-100 dark:bg-green-900/30"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-600 dark:text-green-400">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </Box>
                <Text className="text-zinc-700 dark:text-zinc-300">
                  We&apos;ve sent a password reset link to <strong>{email}</strong>
                </Text>
                <Text fontSize="sm" className="text-zinc-600 dark:text-zinc-400">
                  The link will expire in 1 hour. Didn&apos;t receive it? Check your spam folder.
                </Text>
                <Link href="/login">
                  <Button
                    w="full"
                    className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Back to Login
                  </Button>
                </Link>
              </Stack>
            ) : (
              <Box as="form" onSubmit={handleSubmit}>
                <Stack gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2} className="text-black dark:text-white">
                      Email
                    </Text>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={loading}
                    />
                  </Box>

                  <Button
                    type="submit"
                    disabled={loading}
                    loading={loading}
                    className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>

          <Text textAlign="center" fontSize="sm" className="text-zinc-600 dark:text-zinc-400">
            Remember your password?{" "}
            <Link href="/login" className="text-black dark:text-white font-medium underline-offset-4 hover:underline">
              Log in
            </Link>
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
