"use client";

import { useState } from "react";
import ProductMedia from "./ProductMedia";
import ImageLightbox from "./ImageLightbox";

interface ProductMediaWrapperProps {
  mainVideo: string | null;
  mainImage: string;
  galleryImages: string[];
  allImages: string[];
  productName: string;
}

export default function ProductMediaWrapper({
  mainVideo,
  mainImage,
  galleryImages,
  allImages,
  productName,
}: ProductMediaWrapperProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (imageUrl: string) => {
    const index = allImages.indexOf(imageUrl);
    if (index !== -1) setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % allImages.length);
    }
  };

  const previousImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : allImages.length - 1);
    }
  };

  return (
    <>
      <ProductMedia
        mainVideo={mainVideo}
        mainImage={mainImage}
        galleryImages={galleryImages}
        productName={productName}
        onImageClick={openLightbox}
      />

      {lightboxIndex !== null && (
        <ImageLightbox
          images={allImages}
          currentIndex={lightboxIndex}
          productName={productName}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrevious={previousImage}
        />
      )}
    </>
  );
}
