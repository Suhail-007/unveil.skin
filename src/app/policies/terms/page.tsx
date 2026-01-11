import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Link,
} from "@chakra-ui/react";
import Image from "next/image";

export default function TermsPage() {

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
            Terms & Conditions
          </Heading>
          
          <Text fontSize="sm" className="text-zinc-500 dark:text-zinc-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>

          <Stack gap={6}>
            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Acceptance of Terms
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Product Information
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content on this site is accurate, complete, reliable, current, or error-free.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Pricing and Payment
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                All prices are in Indian Rupees (INR) and are subject to change without notice. Payment must be made at the time of purchase through our accepted payment methods.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Limitation of Liability
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                unveil.skin shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our products or services.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Contact Us
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                For any questions regarding these Terms & Conditions, please contact us at{" "}
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

