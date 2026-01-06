'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Box, HStack, Separator, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { useColorModeValue } from '@/components/ui/color-mode';
import { PageContainer } from '@/components/layout/PageContainer';

export default function Footer() {
  const logoSrc = useColorModeValue('/Logo_Dark.svg', '/Logo.svg');

  return (
    <Box as='footer' borderTop='1px' className='border-zinc-200 dark:border-zinc-800' py={{ base: 10, md: 14 }}>
      <PageContainer>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={{ base: 8, md: 10 }} mb={{ base: 8, md: 10 }}>
          <Stack gap={4}>
            <Image
              src={logoSrc}
              alt='unveil.skin'
              width={200}
              height={64}
              style={{ width: '128px', height: 'auto' }}
              className='w-auto'
            />
            <Text fontSize='sm' className='text-zinc-600 dark:text-zinc-400'>
              Formulated and crafted in India. Dermatologist-guided, clinically vetted, and mindful of the planet.
            </Text>
          </Stack>

          <Stack gap={4}>
            <Text
              fontSize='xs'
              fontWeight='semibold'
              letterSpacing='widest'
              textTransform='uppercase'
              className='text-zinc-500 dark:text-zinc-400'>
              Marketed by
            </Text>
            <Image
              src='/favicon.svg'
              alt='unveil.skin'
              width={48}
              height={48}
              style={{ width: '48px', height: '48px' }}
              className='w-12 h-12'
            />
            <Text fontSize='sm' className='text-zinc-700 dark:text-zinc-300'>
              Unveil Skin
              <br />
              New Delhi, India
            </Text>
          </Stack>

          <Stack gap={4}>
            <Text
              fontSize='xs'
              fontWeight='semibold'
              letterSpacing='widest'
              textTransform='uppercase'
              className='text-zinc-500 dark:text-zinc-400'>
              Contact
            </Text>

            <HStack gap={3}>
              <EmailIcon boxSize={4} />
              <Link href='mailto:queries@unveil.skin'>
                <Text fontSize='sm' className='text-zinc-700 dark:text-zinc-300 underline-offset-4 hover:underline'>
                  queries@unveil.skin
                </Text>
              </Link>
            </HStack>

            <Text
              fontSize='xs'
              fontWeight='semibold'
              letterSpacing='widest'
              textTransform='uppercase'
              className='text-zinc-500 dark:text-zinc-400'
              mt={4}>
              Policies
            </Text>

            <Stack gap={2}>
              <Link href='/policies/privacy'>
                <Text fontSize='sm' className='text-zinc-700 dark:text-zinc-300 underline-offset-4 hover:underline'>
                  Privacy Policy
                </Text>
              </Link>
              <Link href='/policies/terms'>
                <Text fontSize='sm' className='text-zinc-700 dark:text-zinc-300 underline-offset-4 hover:underline'>
                  Terms & Conditions
                </Text>
              </Link>
              <Link href='/policies/refund'>
                <Text fontSize='sm' className='text-zinc-700 dark:text-zinc-300 underline-offset-4 hover:underline'>
                  Refund Policy
                </Text>
              </Link>
              <Link href='/policies/shipping'>
                <Text fontSize='sm' className='text-zinc-700 dark:text-zinc-300 underline-offset-4 hover:underline'>
                  Shipping Policy
                </Text>
              </Link>
            </Stack>
          </Stack>

          <Stack gap={4}>
            <Text
              fontSize='xs'
              fontWeight='semibold'
              letterSpacing='widest'
              textTransform='uppercase'
              className='text-zinc-500 dark:text-zinc-400'>
              We Accept
            </Text>
            <HStack gap={2} flexWrap='wrap'>
              <Box
                px={3}
                py={1.5}
                borderRadius='md'
                className='bg-zinc-100 dark:bg-zinc-800'
                fontSize='xs'
                fontWeight='semibold'
                color='zinc.700'
                _dark={{ color: 'zinc.300' }}>
                UPI
              </Box>
              <Box
                px={3}
                py={1.5}
                borderRadius='md'
                className='bg-zinc-100 dark:bg-zinc-800'
                fontSize='xs'
                fontWeight='semibold'
                color='zinc.700'
                _dark={{ color: 'zinc.300' }}>
                RuPay
              </Box>
              <Box
                px={3}
                py={1.5}
                borderRadius='md'
                className='bg-zinc-100 dark:bg-zinc-800'
                fontSize='xs'
                fontWeight='semibold'
                color='zinc.700'
                _dark={{ color: 'zinc.300' }}>
                Visa
              </Box>
              <Box
                px={3}
                py={1.5}
                borderRadius='md'
                className='bg-zinc-100 dark:bg-zinc-800'
                fontSize='xs'
                fontWeight='semibold'
                color='zinc.700'
                _dark={{ color: 'zinc.300' }}>
                Mastercard
              </Box>
            </HStack>
          </Stack>
        </SimpleGrid>

        <Separator my={{ base: 8, md: 10 }} borderColor='gray.200' _dark={{ borderColor: 'gray.800' }} />

        <Stack direction={{ base: 'column', md: 'row' }} justify='space-between' gap={4}>
          <Text fontSize='xs' className='text-zinc-500 dark:text-zinc-500'>
            © {new Date().getFullYear()} Unveil Skin. All rights reserved.
          </Text>
          <Text fontSize='xs' className='text-zinc-400 dark:text-zinc-500'>
            *Products are cosmetic formulations. Not a substitute for medical advice.
          </Text>
        </Stack>
      </PageContainer>
    </Box>
  );
}
