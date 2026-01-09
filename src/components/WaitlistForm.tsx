"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Input,
  Button,
  Stack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { joinWaitlist } from "@/lib/services/waitlist.service";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // hydrate last email if present
    try {
      const last = localStorage.getItem("unveil.waitlist.lastEmail");
      if (last) setEmail(last);
    } catch {}
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await joinWaitlist({ email, name: name.trim() || undefined });

      // Save email to localStorage for convenience
      try {
        localStorage.setItem("unveil.waitlist.lastEmail", email);
      } catch {}

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <Box 
        borderRadius="2xl" 
        p={8} 
        textAlign="center"
        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
      >
        <Box mb={3} fontSize="3xl">
          ✓
        </Box>
        <Heading as="h3" fontSize="xl" mb={2} className="text-green-900 dark:text-green-100">
          You&apos;re on the list!
        </Heading>
        <Text fontSize="sm" className="text-green-700 dark:text-green-300">
          We&apos;ll notify you at <Box as="span" fontWeight="semibold">{email}</Box> when we launch.
        </Text>
      </Box>
    );
  }

  return (
    <Box 
      borderRadius="2xl" 
      p={8} 
      className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 shadow-lg"
    >
      <Stack gap={6}>
        <Box>
          <Heading as="h3" fontSize="2xl" mb={2} className="text-black dark:text-white">
            Join the Waitlist
          </Heading>
          <Text fontSize="sm" className="text-zinc-600 dark:text-zinc-400">
            Be the first to know when we launch. Get exclusive early access and special offers.
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack gap={3}>
            <Input
              id="name"
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              size="lg"
              className="border-zinc-300 bg-white text-black focus:border-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-white disabled:opacity-50"
              aria-label="Name"
            />
            <Input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              disabled={loading}
              size="lg"
              className="border-zinc-300 bg-white text-black focus:border-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-white disabled:opacity-50"
              aria-label="Email address"
            />
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
            >
              {loading ? "Adding you..." : "Notify Me"}
            </Button>
          </Stack>
          {error && (
            <Box mt={3} fontSize="sm" className="text-red-500 dark:text-red-400">
              {error}
            </Box>
          )}
        </form>
      </Stack>
    </Box>
  );
}
