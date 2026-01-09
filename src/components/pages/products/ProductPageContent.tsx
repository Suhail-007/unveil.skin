import Link from 'next/link';
import { Box, Heading, HStack, Text } from '@chakra-ui/react';
import { PageContainer } from '@/components/layout/PageContainer';
import { AnimatedProductGrid, AnimatedDetails } from '@/components/products/AnimatedProductGrid';
import ProductMediaWrapper from '@/components/pages/products/ProductMediaWrapper';
import ProductDetails from '@/components/pages/products/ProductDetails';
import ProductInfoSection from '@/components/pages/products/ProductInfoSection';
import ContentMarkdownWrapper from '@/components/pages/products/ContentMarkdownWrapper';
import AdditionalSections from '@/components/pages/products/AdditionalSections';
import { type Product } from '@/lib/services/product.service';

interface ProductPageContentProps {
  product: Product | null;
}

export default function ProductPageContent({ product }: ProductPageContentProps) {
  if (!product) {
    return (
      <PageContainer size='standard' py={{ base: 12, md: 16 }}>
        <Box textAlign='center' py={20}>
          <Heading size='lg' mb={4}>
            Product Not Found
          </Heading>
          <Link href='/'>
            <Text color='blue.500' textDecoration='underline'>
              Return to home
            </Text>
          </Link>
        </Box>
      </PageContainer>
    );
  }

  const displayPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price || 0;

  // Find main video from videos object
  const mainVideo = product.videos ? Object.values(product.videos).find(vid => vid.isMain)?.url : null;

  // Find main image from images object
  const mainImage = product.images
    ? Object.values(product.images).find(img => img.isMain)?.url || Object.values(product.images)[0]?.url
    : '/assets/placeholder.jpg';

  // Get gallery images based on priority:
  // If main video exists, show ALL images (including main image) in gallery
  // If no main video, show only other images (not main) in gallery
  const galleryImages = product.images
    ? mainVideo
      ? Object.values(product.images).map(img => img.url) // All images if video exists
      : Object.values(product.images)
          .filter(img => !img.isMain)
          .map(img => img.url) // Other images if no video
    : [];

  // All images for lightbox (include main image regardless)
  const allImages = product.images ? Object.values(product.images).map(img => img.url) : [];

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
        <ProductMediaWrapper
          mainVideo={mainVideo ?? null}
          mainImage={mainImage}
          galleryImages={galleryImages}
          allImages={allImages}
          productName={product.name}
        />

        <AnimatedDetails>
          <ProductDetails product={product} displayPrice={displayPrice} mainImage={mainImage} />
        </AnimatedDetails>
      </AnimatedProductGrid>

      {/* How to Use & Dermatologist Notes Section */}
      <ProductInfoSection howToUse={product.how_to_use} dermatologistNotes={product.dermatologist_notes} />

      {/* Content Markdown Section */}
      {product.content_markdown && <ContentMarkdownWrapper content={product.content_markdown} />}

      {/* Additional Sections - extract from all JSONB fields */}
      <AdditionalSections
        benefits={product.benefits}
        howToUse={product.how_to_use}
        dermatologistNotes={product.dermatologist_notes}
      />

      {/* JSON-LD Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: mainImage,
            brand: {
              '@type': 'Brand',
              name: 'ORDYN by unveil.skin',
            },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              price: displayPrice,
              availability: displayPrice > 0 ? 'https://schema.org/PreOrder' : 'https://schema.org/PreOrder',
            },
          }),
        }}
      />
    </PageContainer>
  );
}
