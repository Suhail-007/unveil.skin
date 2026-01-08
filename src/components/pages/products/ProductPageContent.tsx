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

            {product.benefits && Object.keys(product.benefits).filter(([key]) => !key.toLowerCase().startsWith('additional')).length > 0 && (
              <Box borderTop="1px solid" borderColor="gray.200" _dark={{ borderColor: "gray.700" }} pt={6}>
                <Heading as="h3" fontSize="lg" fontWeight="semibold" mb={4}>
                  Benefits
                </Heading>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={6}>
                  {Object.entries(product.benefits)
                    .filter(([key]) => !key.toLowerCase().startsWith('additional'))
                    .map(([key, value]) => (
                      <AnimatedBenefit key={key}>
                        <Text fontWeight="semibold" mb={1}>{key}</Text>
                        <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                          {value}
                        </Text>
                      </AnimatedBenefit>
                    ))}
                </SimpleGrid>
              </Box>
            )}
          </Stack>
        </AnimatedDetails>
      </AnimatedProductGrid>

      {/* How to Use & Dermatologist Notes Section */}
      {(product.how_to_use || product.dermatologist_notes) && (
        <Box mt={16}>
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            {/* How to use card */}
            {product.how_to_use && Object.keys(product.how_to_use).filter(([key]) => !key.toLowerCase().startsWith('additional')).length > 0 && (
              <Box p={6} borderRadius="xl" bg="gray.900" _dark={{ bg: "gray.900" }}>
                <HStack gap={3} mb={4}>
                  <Box flexShrink={0}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" className="text-blue-500"/>
                      <path d="M10 6v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-500"/>
                    </svg>
                  </Box>
                  <Heading as="h2" fontSize="lg" fontWeight="bold" color="white">
                    How to use
                  </Heading>
                </HStack>
                <Stack gap={4}>
                  {Object.entries(product.how_to_use)
                    .filter(([key]) => !key.toLowerCase().startsWith('additional'))
                    .map(([step, instruction]) => {
                      const stepNumber = step.match(/^\d+/)?.[0];
                      return (
                        <HStack key={step} align="start" gap={3}>
                          {stepNumber && (
                            <Box
                              flexShrink={0}
                              w={6}
                              h={6}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontWeight="bold"
                              fontSize="sm"
                              color="gray.400"
                            >
                              {stepNumber}
                            </Box>
                          )}
                          <Text fontSize="sm" color="gray.300">
                            {instruction}
                          </Text>
                        </HStack>
                      );
                    })}
                </Stack>
              </Box>
            )}

            {/* Dermatologist notes card */}
            {product.dermatologist_notes && Object.keys(product.dermatologist_notes).filter(([key]) => !key.toLowerCase().startsWith('additional')).length > 0 && (
              <Box p={6} borderRadius="xl" bg="gray.900" _dark={{ bg: "gray.900" }}>
                <HStack gap={3} mb={4}>
                  <Box flexShrink={0}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" className="text-red-500"/>
                      <path d="M10 6v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-red-500"/>
                    </svg>
                  </Box>
                  <Heading as="h2" fontSize="lg" fontWeight="bold" color="white">
                    Dermatologist notes
                  </Heading>
                </HStack>
                <Stack gap={3}>
                  {Object.entries(product.dermatologist_notes)
                    .filter(([key]) => !key.toLowerCase().startsWith('additional'))
                    .map(([title, note]) => (
                      <HStack key={title} align="start" gap={3}>
                        <Box flexShrink={0} mt={0.5}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-green-500">
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                          </svg>
                        </Box>
                        <Text fontSize="sm" color="gray.300">
                          {note}
                        </Text>
                      </HStack>
                    ))}
                </Stack>
                <Text fontSize="xs" mt={4} color="gray.500">
                  Cosmetic product. Reapply for continued protection.
                </Text>
              </Box>
            )}
          </SimpleGrid>
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
                {sectionKey.replace(/additional\d*/i, '').trim() || 'What makes it work'}
              </Heading>
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6}>
                {Object.entries(sectionData).map(([title, content]) => (
                  <Box key={title}>
                    <Text fontWeight="semibold" mb={2}>{title}</Text>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
                      {content}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
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
