"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Input,
  Button,
  Stack,
} from "@chakra-ui/react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // hydrate last email if present
    try {
      const last = localStorage.getItem("unveil.waitlist.lastEmail");
      if (last) setEmail(last);
    } catch {}
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    try {
      const key = "unveil.waitlist.emails";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const next = Array.isArray(existing) ? existing : [];
      if (!next.includes(email)) next.push(email);
      localStorage.setItem(key, JSON.stringify(next));
      localStorage.setItem("unveil.waitlist.lastEmail", email);
    } catch {}
    setSubmitted(true);
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
      <Stack direction={{ base: "column", sm: "row" }} gap={3}>
        <Box flex={1}>
          <Input
            id="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            borderRadius="full"
            className="border-zinc-300 bg-white text-black focus:border-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
            aria-label="Email address"
          />
        </Box>
        <Button
          type="submit"
          borderRadius="full"
          className="bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Notify me
        </Button>
      </Stack>
    </form>
  );
}
