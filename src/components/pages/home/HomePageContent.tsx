import { Box } from "@chakra-ui/react";
import { PageContainer } from "@/components/layout/PageContainer";
import HeroSection from "./HeroSection";
import WaitlistSection from "./WaitlistSection";
import WelcomeModal from "./WelcomeModal";

export default function HomePageContent({ children }: { children: React.ReactNode }) {
  return (
    <Box minH="100vh" className="bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-black dark:via-zinc-950 dark:to-zinc-900">
      <PageContainer as="main" py={{ base: 12, md: 20 }}>
        <HeroSection />
        {children}
        <WaitlistSection />
      </PageContainer>
      <WelcomeModal />
    </Box>
  );
}
