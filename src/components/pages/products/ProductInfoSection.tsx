"use client";

import { Box, SimpleGrid } from "@chakra-ui/react";
import HowToUseCard from "./HowToUseCard";
import DermatologistNotesCard from "./DermatologistNotesCard";
import { useFeatureFlags } from "@/lib/features/FeatureFlagsContext";
import { Product } from "../../../lib/services";

interface ProductInfoSectionProps {
  howToUse?: Product['how_to_use'];
  dermatologistNotes?: Product['dermatologist_notes'];
}

export default function ProductInfoSection({ howToUse, dermatologistNotes }: ProductInfoSectionProps) {
  const { flags } = useFeatureFlags();

  const showHowToUse = flags.showHowToUse && howToUse;
  const showDermatologistNotes = flags.showDermatologistNotes && dermatologistNotes;

  if (!showHowToUse && !showDermatologistNotes) {
    return null;
  }

  return (
    <Box mt={16}>
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
        {showHowToUse && <HowToUseCard howToUse={howToUse} />}
        {showDermatologistNotes && <DermatologistNotesCard dermatologistNotes={dermatologistNotes} />}
      </SimpleGrid>
    </Box>
  );
}
