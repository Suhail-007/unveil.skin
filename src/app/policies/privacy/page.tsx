import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Link,
} from "@chakra-ui/react";
import Image from "next/image";

export default function PrivacyPolicyPage() {

  return (
    <Box minH="100vh" className="bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-black dark:via-zinc-950 dark:to-zinc-900">
      <Box as="header" borderBottom="1px" className="border-zinc-200 dark:border-zinc-800">
        <Container maxW="7xl" px={{ base: 4, md: 6 }} py={6}>
          <Link href="/">
            <Image
              src="/Logo_Dark.svg"
              alt="unveil.skin"
              width={180}
              height={53}
              priority
              style={{ height: '32px', width: 'auto' }}
              className="h-8 w-auto dark:hidden"
            />
            <Image
              src="/Logo.svg"
              alt="unveil.skin"
              width={180}
              height={53}
              priority
              style={{ height: '32px', width: 'auto' }}
              className="h-8 w-auto hidden dark:block"
            />
          </Link>
        </Container>
      </Box>

      <Container maxW="4xl" px={{ base: 4, md: 6 }} py={{ base: 12, md: 16 }}>
        <Stack gap={8}>
          <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} className="text-black dark:text-white">
            Privacy Policy
          </Heading>
          
          <Text fontSize="sm" className="text-zinc-500 dark:text-zinc-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>

          <Stack gap={6}>
            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Introduction
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                At unveil.skin, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Information We Collect
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                We may collect information that you provide directly to us, including your name, email address, shipping address, payment information, and any other information you choose to provide.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                How We Use Your Information
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                We use the information we collect to process your orders, communicate with you, improve our services, and comply with legal obligations.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Data Security
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Contact Us
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                If you have questions about this Privacy Policy, please contact us at{" "}
                <Link href="mailto:queries@unveil.skin" className="text-[#c88d8d] underline">
                  queries@unveil.skin
                </Link>
              </Text>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

