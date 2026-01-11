"use client";

import { Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import WaitlistForm from "@/components/WaitlistForm";
import { Section } from "@/components/layout/Section";
import { useFeatureFlags } from "@/lib/features/FeatureFlagsContext";

const MotionSection = motion(Section);

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] as const },
  },
};

export default function WaitlistSection() {
  const { flags } = useFeatureFlags();
  
  if (!flags.showWaitlist) {
    return null;
  }
  
  return (
    <MotionSection
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-120px" }}
      variants={fadeInUp}
    >
      <Stack gap={4} align="center" textAlign="center" maxW="md" mx="auto">
        <Text fontSize="sm" className="text-zinc-600 dark:text-zinc-400">
          Get notified when we launch
        </Text>
        <WaitlistForm />
      </Stack>
    </MotionSection>
  );
}
