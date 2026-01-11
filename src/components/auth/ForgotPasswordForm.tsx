"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Stack, Text } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setSubmitted(true);
      toaster.create({
        title: "Password reset email sent",
        description: "Check your email for the password reset link",
        duration: 5000,
        type: "success",
      });
    } catch (error: any) {
      toaster.create({
        title: "Error sending reset email",
        description: error.message || "Something went wrong",
        duration: 5000,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Stack gap={4}>
        <Text className="text-zinc-600 dark:text-zinc-400" textAlign="center">
          We&apos;ve sent a password reset link to <strong>{email}</strong>
        </Text>
        <Text className="text-zinc-600 dark:text-zinc-400" textAlign="center">
          Please check your inbox and follow the instructions.
        </Text>
        <Text textAlign="center" fontSize="sm" className="text-zinc-600 dark:text-zinc-400" mt={4}>
          <Link href="/login" className="text-black dark:text-white font-medium underline-offset-4 hover:underline">
            Back to login
          </Link>
        </Text>
      </Stack>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Stack gap={2}>
          <Text fontSize="sm" fontWeight="medium" className="text-black dark:text-white">
            Email
          </Text>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
          />
        </Stack>

        <Button
          type="submit"
          colorPalette="blue"
          width="full"
          size="lg"
          loading={loading}
        >
          Send Reset Link
        </Button>
      </Stack>
    </form>
  );
}
