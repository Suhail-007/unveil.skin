"use client";

import Image from "next/image";
import { Box, SimpleGrid, Stack } from "@chakra-ui/react";
import { AnimatedImage } from "@/components/products/AnimatedProductGrid";

interface ProductMediaProps {
  mainVideo: string | null;
  mainImage: string;
  galleryImages: string[];
  productName: string;
  onImageClick: (imageUrl: string) => void;
}

export default function ProductMedia({
  mainVideo,
  mainImage,
  galleryImages,
  productName,
  onImageClick,
}: ProductMediaProps) {
  return (
    <Box>
      {mainVideo ? (
        <Stack gap={3}>
          {/* Main Video */}
          <AnimatedImage>
            <video src={mainVideo} autoPlay muted loop style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AnimatedImage>

          {/* Gallery Images - all images when video exists */}
          {galleryImages.length > 0 && (
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap={3}>
              {galleryImages.map((imgUrl, idx) => (
                <Box
                  key={idx}
                  position="relative"
                  aspectRatio={1}
                  borderRadius="md"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="gray.200"
                  _dark={{ borderColor: "gray.700" }}
                  cursor="pointer"
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.05)" }}
                  onClick={() => onImageClick(imgUrl)}
                >
                  <Image
                    src={imgUrl}
                    alt={`${productName} - Image ${idx + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Stack>
      ) : (
        <Stack gap={3}>
          {/* Main Image */}
          <AnimatedImage>
            <Box
              position="relative"
              width="100%"
              height="100%"
              cursor="pointer"
              onClick={() => onImageClick(mainImage)}
            >
              <Image
                src={mainImage}
                alt={productName}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </Box>
          </AnimatedImage>

          {/* Gallery Images - other images when no video */}
          {galleryImages.length > 0 && (
            <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} gap={3}>
              {galleryImages.map((imgUrl, idx) => (
                <Box
                  key={idx}
                  position="relative"
                  aspectRatio={1}
                  borderRadius="md"
                  overflow="hidden"
                  border="1px solid"
                  borderColor="gray.200"
                  _dark={{ borderColor: "gray.700" }}
                  cursor="pointer"
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.05)" }}
                  onClick={() => onImageClick(imgUrl)}
                >
                  <Image
                    src={imgUrl}
                    alt={`${productName} - Image ${idx + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Stack>
      )}
    </Box>
  );
}
