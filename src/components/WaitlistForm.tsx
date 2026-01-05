"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Input,
  Button,
  Stack,
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
      <Box borderRadius="xl" p={4} fontSize="sm" className="bg-zinc-50 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
        Thanks! We&apos;ll let you know at <Box as="span" fontWeight="medium">{email}</Box> when we&apos;re ready.
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction={{ base: "column", sm: "row" }} gap={3} align={{ base: "stretch", sm: "flex-end" }}>
        <Stack direction={{ base: "column", sm: "row" }} gap={2} flex={1}>
          <Input
            id="name"
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            borderRadius="full"
            size={{ base: "md", sm: "md" }}
            className="border-zinc-300 bg-white text-black focus:border-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-white disabled:opacity-50"
            aria-label="Name"
            flex={{ base: "1", sm: "0 0 auto" }}
            minW={{ base: "100%", sm: "160px" }}
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
            borderRadius="full"
            size={{ base: "md", sm: "md" }}
            className="border-zinc-300 bg-white text-black focus:border-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-white disabled:opacity-50"
            aria-label="Email address"
            flex={1}
          />
        </Stack>
        <Button
          type="submit"
          disabled={loading}
          borderRadius="full"
          size={{ base: "md", sm: "md" }}
          px={8}
          className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50"
          flexShrink={0}
        >
          {loading ? "Adding..." : "Notify me"}
        </Button>
      </Stack>
      {error && (
        <Box mt={2} fontSize="xs" color="red.500" className="text-red-500 dark:text-red-400">
          {error}
        </Box>
      )}
    </form>
  );
}
