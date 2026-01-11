import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Link,
} from "@chakra-ui/react";
import Image from "next/image";

export default function ShippingPolicyPage() {

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
            Shipping Policy
          </Heading>
          
          <Text fontSize="sm" className="text-zinc-500 dark:text-zinc-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>

          <Stack gap={6}>
            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Shipping Information
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                We currently ship within India. Orders are typically processed within 2-3 business days and delivered within 5-7 business days via our shipping partners.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Shipping Costs
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                Shipping costs are calculated at checkout based on your delivery address and chosen shipping method. Free shipping may be available on orders above a certain value.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Order Tracking
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                Once your order ships, you will receive a tracking number via email that you can use to track your package.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Contact Us
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                For any shipping inquiries, please contact us at{" "}
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

