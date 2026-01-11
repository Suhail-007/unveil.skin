"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Stack, Text } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user has valid reset token
    const supabase = createClient();
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // User has valid token
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toaster.create({
        title: "Password updated successfully",
        description: "You can now log in with your new password",
        duration: 5000,
        type: "success",
      });

      // Redirect to login after short delay
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Something went wrong");
      toaster.create({
        title: "Error updating password",
        description: error.message || "Something went wrong",
        duration: 5000,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={4}>
        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}

        <Stack gap={2}>
          <Text fontSize="sm" fontWeight="medium" className="text-black dark:text-white">
            New Password
          </Text>
          <Input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
          />
        </Stack>

        <Stack gap={2}>
          <Text fontSize="sm" fontWeight="medium" className="text-black dark:text-white">
            Confirm Password
          </Text>
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          Update Password
        </Button>
      </Stack>
    </form>
  );
}
