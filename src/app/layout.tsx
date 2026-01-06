import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Provider from '../components/providers/provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://unveil.skin'),
  title: 'unveil.skin | Unveil Your Real Skin',
  description:
    'Meet ORDYN by unveil.skin: dermatologist-formulated soap bar and daily sunscreen that reveal your real skin with gentle clarity and invisible protection. Formulated for Indian climates with clinical efficacy.',
  keywords: [
    'dermatologist skin care',
    'India skincare',
    'sunscreen SPF 50',
    'soap bar cleanser',
    'niacinamide skincare',
    'cruelty free beauty',
    'vegan skincare',
    'clear skin routine',
    'acne skincare',
    'brightening products',
  ],
  authors: [{ name: 'Unveil Skin' }],
  creator: 'Unveil Skin',
  publisher: 'Unveil Skin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-128x128.png', sizes: '128x128', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'android-chrome',
        type: 'image/png',
        sizes: '192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome',
        type: 'image/png',
        sizes: '512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'unveil.skin',
    title: 'unveil.skin | Unveil Your Real Skin',
    description:
      'Meet ORDYN by unveil.skin: dermatologist-formulated soap bar and daily sunscreen that reveal your real skin with gentle clarity and invisible protection.',
    images: [
      {
        url: '/assets/Products-Lifestlye.png',
        width: 1200,
        height: 630,
        alt: 'ORDYN by unveil.skin products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'unveil.skin | Unveil Your Real Skin',
    description:
      'Meet ORDYN by unveil.skin: dermatologist-formulated soap bar and daily sunscreen that reveal your real skin with gentle clarity and invisible protection.',
    images: ['/assets/Products-Lifestlye.png'],
    creator: '@unveilskin',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.YANDEX_VERIFICATION || undefined,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased`}>
        <Provider>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </Provider>
        <Analytics />
      </body>
    </html>
  );
}
