import {
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Link,
} from "@chakra-ui/react";
import Image from "next/image";

export default function RefundPolicyPage() {

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
            Refund & Return Policy
          </Heading>
          
          <Text fontSize="sm" className="text-zinc-500 dark:text-zinc-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>

          <Stack gap={6}>
            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Return Policy
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                We want you to be completely satisfied with your purchase. If you are not satisfied, you may return unopened and unused products within 7 days of delivery for a full refund.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Eligibility for Returns
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                Products must be in their original, unopened packaging and in the same condition as received. Returns must be initiated within 7 days of delivery.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Refund Process
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed to the original payment method within 5-7 business days.
              </Text>
            </Box>

            <Box>
              <Heading as="h2" fontSize="xl" mb={3} className="text-black dark:text-white">
                Contact Us
              </Heading>
              <Text fontSize="sm" lineHeight="1.8" className="text-zinc-600 dark:text-zinc-300">
                To initiate a return, please contact us at{" "}
                <Link href="mailto:queries@unveil.skin" className="text-[#c88d8d] underline">
                  queries@unveil.skin
                </Link> with your order number and reason for return.
              </Text>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

