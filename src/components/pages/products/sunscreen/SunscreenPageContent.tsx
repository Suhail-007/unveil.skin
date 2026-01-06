import Image from 'next/image';
import Link from 'next/link';
import {
  Badge,
  Box,
  Grid,
  Heading,
  HStack,
  Icon,
  Separator,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { PageContainer } from "@/components/layout/PageContainer";
import ProductActions from "@/components/products/ProductActions";
import { AnimatedProductGrid, AnimatedImage, AnimatedDetails, AnimatedBenefit } from "@/components/products/AnimatedProductGrid";

const publicBenefits = [
  {
    title: 'Sun Protection',
    copy: 'SPF 50 PA+++ protection.',
  },
  {
    title: 'Pigmentation',
    copy: 'Prevents dark spots.',
  },
  {
    title: 'Tanning',
    copy: 'Prevents tanning.',
  },
  {
    title: 'Anti-aging',
    copy: 'Prevents premature aging.',
  },
];

const ingredients = [
  {
    title: 'UV filters',
    copy: 'Protection against UVA, UVB, and blue light.',
  },
  {
    title: 'Niacinamide',
    copy: 'Brightens and controls oil.',
  },
  {
    title: 'Ceramides',
    copy: 'Strengthens skin barrier.',
  },
];

const howToUse = [
  'Apply as final step of AM routine.',
  'Use two finger-lengths for face and neck.',
  'Tap and spread until invisible.',
  'Reapply every 2-3 hours outdoors.',
  'Pair with ORDYN Soap Bar in PM.',
];

const dermNotes = [
  'Layer over moisturiser for acne-prone skin.',
  'Avoid broken skin. Consult dermatologist for photosensitivity.',
  'Combine with hats, shade, and sunglasses.',
];

export default function SunscreenPageContent() {
  return (
    <PageContainer size='standard' py={{ base: 12, md: 16 }}>
      {/* Back Link */}
      <Link href='/'>
        <HStack
          mb={8}
          gap={2}
          color='gray.700'
          _dark={{ color: 'gray.300' }}
          _hover={{ color: 'black', _dark: { color: 'white' } }}
          transition='color 0.2s'>
          <svg
            width={16}
            height={16}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            style={{ display: 'inline-block' }}>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
          </svg>
          <Text fontSize='sm'>Back to products</Text>
        </HStack>
      </Link>

      {/* Product Grid */}
      <AnimatedProductGrid>
        <AnimatedImage>
          <Image
            src='/assets/Sunscreen_mainside_and_Soap.jpg'
            alt='Ordyn daily sunscreen'
            fill
            style={{ objectFit: 'cover' }}
            sizes='(max-width: 1024px) 100vw, 50vw'
            priority
          />
        </AnimatedImage>

        {/* Product Details */}
        <AnimatedDetails>
          <Stack gap={3}>
            <Badge
              alignSelf='flex-start'
              borderRadius='full'
              px={3}
              py={1}
              fontSize='xs'
              fontWeight='semibold'
              letterSpacing='wider'
              textTransform='uppercase'
              colorScheme='purple'>
              Invisible defense
            </Badge>
            <Stack gap={2}>
              <Text fontSize='sm' fontWeight='medium' color='gray.600' _dark={{ color: 'gray.400' }}>
                ORDYN
              </Text>
              <Heading
                as='h1'
                fontSize={{ base: '4xl', sm: '5xl' }}
                fontWeight='bold'
                letterSpacing='tight'
                color='black'
                _dark={{ color: 'white' }}>
                Daily Sunscreen
              </Heading>
            </Stack>
          </Stack>

          <Stack gap={4}>
            <Text fontSize='lg' lineHeight='1.7' color='gray.600' _dark={{ color: 'gray.200' }}>
              Broad-spectrum SPF 50 with niacinamide. Zero white cast, perfect under makeup.
            </Text>
          </Stack>

          <ProductActions productId="sunscreen" productName="ORDYN Daily Sunscreen" />

          <Box>
            <Heading as='h2' fontSize='xl' fontWeight='semibold' mb={6} color='black' _dark={{ color: 'white' }}>
              Benefits
            </Heading>
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
              {publicBenefits.map(benefit => (
                <AnimatedBenefit key={benefit.title}>
                  <Text fontSize='sm' fontWeight='semibold' color='black' _dark={{ color: 'white' }} mb={1}>
                    {benefit.title}
                  </Text>
                  <Text fontSize='xs' lineHeight='1.5' color='gray.600' _dark={{ color: 'gray.300' }}>
                    {benefit.copy}
                  </Text>
                </AnimatedBenefit>
              ))}
            </SimpleGrid>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
            <Stack
              bg='gray.50'
              borderRadius='xl'
              border='1px'
              borderColor='gray.200'
              _dark={{ bg: 'gray.900', borderColor: 'gray.800' }}
              p={6}
              gap={5}>
              <HStack gap={3}>
                <Box color='purple.400' fontSize='20px'>
                  <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
                  </svg>
                </Box>
                <Heading as='h2' fontSize='md' fontWeight='semibold'>
                  How to use
                </Heading>
              </HStack>
              <Stack as='ol' gap={3} m={0} p={0} listStyleType='none'>
                {howToUse.map((step, index) => (
                  <HStack as='li' key={step} align='flex-start' gap={3}>
                    <Badge borderRadius='full' px={2} py={1} fontSize='xs' colorScheme='blackAlpha'>
                      {index + 1}
                    </Badge>
                    <Text fontSize='sm' color='gray.700' _dark={{ color: 'gray.200' }}>
                      {step}
                    </Text>
                  </HStack>
                ))}
              </Stack>
            </Stack>

            <Stack
              bg='white'
              borderRadius='xl'
              border='1px'
              borderColor='gray.200'
              _dark={{ bg: 'gray.950', borderColor: 'gray.800' }}
              p={6}
              gap={4}>
              <HStack gap={3}>
                <Box color='red.400' fontSize='20px'>
                  <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                  </svg>
                </Box>
                <Heading as='h2' fontSize='md' fontWeight='semibold'>
                  Dermatologist notes
                </Heading>
              </HStack>
              <Stack as='ul' gap={3} listStyleType='none' m={0} p={0}>
                {dermNotes.map(note => (
                  <HStack as='li' key={note} align='flex-start' gap={3}>
                    <Box color='#c88d8d' mt={1} fontSize='16px'>
                      <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
                        <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                      </svg>
                    </Box>
                    <Text fontSize='sm' color='gray.700' _dark={{ color: 'gray.200' }}>
                      {note}
                    </Text>
                  </HStack>
                ))}
              </Stack>
              <Separator borderColor='gray.200' _dark={{ borderColor: 'gray.800' }} />
              <Text fontSize='xs' color='gray.500' _dark={{ color: 'gray.400' }}>
                Cosmetic product. Reapply for continued protection.
              </Text>
            </Stack>
          </SimpleGrid>

          <Box mt={8}>
            <Heading as='h2' fontSize='lg' fontWeight='semibold' mb={4} color='black' _dark={{ color: 'white' }}>
              What makes it work
            </Heading>
            <Stack gap={3}>
              {ingredients.map(ingredient => (
                <Box key={ingredient.title}>
                  <Text fontSize='sm' fontWeight='medium' color='black' _dark={{ color: 'white' }} mb={1}>
                    {ingredient.title}
                  </Text>
                  <Text fontSize='xs' lineHeight='1.5' color='gray.600' _dark={{ color: 'gray.300' }}>
                    {ingredient.copy}
                  </Text>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box mt={8} pt={6} borderTop='1px' borderColor='gray.200' _dark={{ borderColor: 'gray.800' }}>
            <Text
              fontSize='xs'
              fontWeight='semibold'
              letterSpacing='widest'
              textTransform='uppercase'
              color='gray.500'
              _dark={{ color: 'gray.400' }}
              mb={2}>
              Manufactured by
            </Text>
            <Text fontSize='sm' color='gray.700' _dark={{ color: 'gray.300' }}>
              XYXX Cosmo
              <br />
              Noida Industrial Area, Uttar Pradesh
            </Text>
          </Box>
        </AnimatedDetails>
      </AnimatedProductGrid>
      
      {/* Product Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'ORDYN Daily Sunscreen',
            description: 'Broad-spectrum SPF 50 with niacinamide. Zero white cast, perfect under makeup.',
            brand: {
              '@type': 'Brand',
              name: 'ORDYN',
            },
            category: 'Skincare',
            image: ['https://unveil.skin/Sunscreen.png'],
            offers: {
              '@type': 'Offer',
              availability: 'https://schema.org/PreOrder',
              priceCurrency: 'INR',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.5',
            },
          }),
        }}
      />
    </PageContainer>
  );
}
