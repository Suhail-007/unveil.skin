"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Badge,
  Box,
  Heading,
  HStack,
  Separator,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PageContainer } from "@/components/layout/PageContainer";
import ProductActions from "@/components/products/ProductActions";
import { AnimatedProductGrid, AnimatedImage, AnimatedDetails, AnimatedBenefit } from "@/components/products/AnimatedProductGrid";
import { type Product } from "@/lib/services/product.service";

interface ProductPageContentProps {
  product: Product | null;
}

export default function ProductPageContent({ product }: ProductPageContentProps) {
  console.log("🚀 ~ ProductPageContent ~ product:", product)
  if (!product) {
    return (
      <PageContainer size="standard" py={{ base: 12, md: 16 }}>
        <Box textAlign="center" py={20}>
          <Heading size="lg" mb={4}>Product Not Found</Heading>
          <Link href="/">
            <Text color="blue.500" textDecoration="underline">
              Return to home
            </Text>
          </Link>
        </Box>
      </PageContainer>
    );
  }

  const displayPrice = typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0);  
  // Find main image from images object
  const mainImage = product.images 
    ? Object.values(product.images).find(img => img.isMain)?.url || Object.values(product.images)[0]?.url
    : "/assets/placeholder.jpg";  
  return (
    <PageContainer size="standard" py={{ base: 12, md: 16 }}>
      {/* Back Link */}
      <Link href="/">
        <HStack
          mb={8}
          gap={2}
          color="gray.700"
          _dark={{ color: "gray.300" }}
          _hover={{ color: "black", _dark: { color: "white" } }}
          transition="color 0.2s"
        >
          <svg
            width={16}
            height={16}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ display: "inline-block" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <Text fontSize="sm">Back to products</Text>
        </HStack>
      </Link>

      {/* Product Grid */}
      <AnimatedProductGrid>
        <AnimatedImage>
          <Image
            src={mainImage}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </AnimatedImage>

        <AnimatedDetails>
          <Stack gap={6}>
            {product.category && (
              <Badge
                alignSelf="flex-start"
                borderRadius="full"
                px={3}
                py={1}
                fontSize="xs"
                fontWeight="medium"
                className="bg-black/10 dark:bg-white/10"
              >
                {product.category}
              </Badge>
            )}

            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold">
              {product.name}
            </Heading>

            <Text fontSize="md" color="gray.600" _dark={{ color: "gray.300" }}>
              {product.details_description || product.description}
            </Text>

            {displayPrice > 0 && (
              <Text fontSize="2xl" fontWeight="bold">
                ₹{displayPrice.toFixed(2)}
              </Text>
            )}

            <ProductActions
              productId={product.id}
              productName={product.name}
              productPrice={displayPrice}
              productImage={mainImage}
            />

            {product.benefits && Object.keys(product.benefits).length > 0 && (
              <Box borderTop="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }} pt={6}>
                <Heading as="h3" fontSize="lg" fontWeight="semibold" mb={4}>
                  Benefits
                </Heading>
                <Stack gap={3}>
                  {Object.entries(product.benefits).map(([key, value]) => (
                    <AnimatedBenefit key={key}>
                      <Text fontWeight="medium">{key}</Text>
                      <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                        {value}
                      </Text>
                    </AnimatedBenefit>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </AnimatedDetails>
      </AnimatedProductGrid>

      {/* How to Use Section */}
      {product.how_to_use && Object.keys(product.how_to_use).length > 0 && (
        <Box mt={16}>
          <Heading as="h2" fontSize="2xl" fontWeight="bold" mb={6}>
            How to Use
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
            {Object.entries(product.how_to_use)
              .filter(([key]) => !key.toLowerCase().startsWith('additional'))
              .map(([step, instruction]) => (
                <Box key={step} p={6} borderRadius="xl" className="bg-gray-50 dark:bg-gray-900">
                  <Text fontWeight="semibold" mb={2}>{step}</Text>
                  <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                    {instruction}
                  </Text>
                </Box>
              ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Dermatologist Notes */}
      {product.dermatologist_notes && Object.keys(product.dermatologist_notes).length > 0 && (
        <Box mt={12}>
          <Heading as="h2" fontSize="2xl" fontWeight="bold" mb={6}>
            Dermatologist Notes
          </Heading>
          <Stack gap={4}>
            {Object.entries(product.dermatologist_notes)
              .filter(([key]) => !key.toLowerCase().startsWith('additional'))
              .map(([title, note]) => (
                <Box key={title} p={4} borderLeft="3px solid" borderColor="blue.500" className="bg-blue-50 dark:bg-blue-900/20">
                  <Text fontWeight="medium" mb={1}>{title}</Text>
                  <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                    {note}
                  </Text>
                </Box>
              ))}
          </Stack>
        </Box>
      )}

      {/* Additional Sections - extract from all JSONB fields */}
      {(() => {
        const additionalSections: Record<string, Record<string, string>> = {};
        
        [product.benefits, product.how_to_use, product.dermatologist_notes].forEach(field => {
          if (field) {
            Object.entries(field).forEach(([key, value]) => {
              if (key.toLowerCase().startsWith('additional')) {
                if (typeof value === 'object') {
                  additionalSections[key] = value as Record<string, string>;
                }
              }
            });
          }
        });

        return Object.keys(additionalSections).length > 0 && (
          Object.entries(additionalSections).map(([sectionKey, sectionData]) => (
            <Box key={sectionKey} mt={12}>
              <Heading as="h2" fontSize="2xl" fontWeight="bold" mb={6}>
                {sectionKey.replace(/additional\d*/i, '').trim() || 'Additional Information'}
              </Heading>
              <Stack gap={4}>
                {Object.entries(sectionData).map(([title, content]) => (
                  <Box key={title} p={4} borderRadius="lg" className="bg-gray-50 dark:bg-gray-900">
                    <Text fontWeight="medium" mb={1}>{title}</Text>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                      {content}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          ))
        );
      })()}

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: mainImage,
            brand: {
              "@type": "Brand",
              name: "ORDYN by unveil.skin",
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "INR",
              price: displayPrice,
              availability: displayPrice > 0 ? "https://schema.org/PreOrder" : "https://schema.org/PreOrder",
            },
          }),
        }}
      />
    </PageContainer>
  );
}
