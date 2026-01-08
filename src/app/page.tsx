import { Suspense } from 'react';
import HomePageContent from '@/components/pages/home/HomePageContent';
import ProductsSection from '@/components/pages/home/ProductsSection';
import ProductGridSkeleton from '@/components/pages/home/ProductGridSkeleton';

// Cache the page for 1 hour (3600 seconds)
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      {/* Hero section renders immediately */}
      <HomePageContent>
        {/* Products stream in parallel */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductsSection />
        </Suspense>
      </HomePageContent>
    </>
  );
}
