import Link from "next/link";
import { Box, Container, Heading, Stack, Text } from "@chakra-ui/react";
import AnimatedBackground from "@/components/auth/AnimatedBackground";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
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
              Reset Password
            </Heading>
            <Text className="text-zinc-600 dark:text-zinc-400">
              Enter your new password

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      toaster.create({
        title: "Password updated",
        description: "Your password has been successfully reset",
        type: "success",
      });

      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
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
              Reset Password
            </Heading>
            <Text className="text-zinc-600 dark:text-zinc-400">
              Enter your new password
            </Text>
          </Box>

          <Box
            p={8}
            borderRadius="2xl"
            className="bg-white/90 backdrop-blur-xl dark:bg-zinc-950/90 border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl"
          >
            <Box as="form" onSubmit={handleSubmit}>
              <Stack gap={4}>
                {error && (
                  <Box
                    px={4}
                    py={3}
                    borderRadius="md"
                    className="bg-red-50 dark:bg-red-900/20"
                  >
                    <Text fontSize="sm" className="text-red-600 dark:text-red-400">
                      {error}
                    </Text>
                  </Box>
                )}

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} className="text-black dark:text-white">
                    New Password
                  </Text>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    minLength={8}
                  />
                </Box>

                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2} className="text-black dark:text-white">
                    Confirm New Password
                  </Text>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    minLength={8}
                  />
                </Box>

                <Button
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </Stack>
            </Box>
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
