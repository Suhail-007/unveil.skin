import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-black dark:via-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
            unveil<span className="text-zinc-400 dark:text-zinc-600">.skin</span>
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        {/* Brand intro */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-black dark:text-white sm:text-6xl">
            Everyday care, quietly excellent
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            unveil<span className="text-zinc-400">.skin</span> crafts daily essentials that feel kind, look
            timeless, and work beautifully. ORDYN is our first line — a simple soap bar and a daily sunscreen.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <Link
              href="#products"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Preview products
            </Link>
          </div>
        </div>

        {/* Product Preview */}
        <div id="products" className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* Soap Bar */}
          <Link
            href="/products/soap-bar"
            className="group relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 transition-transform hover:scale-[1.02]"
          >
            <div className="aspect-square relative">
              <Image
                src="/Soap_bar.png"
                alt="Ordyn soap bar"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-black dark:text-white">Ordyn Soap Bar</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Gentle, fragrance-light cleanse for everyday skin. No fuss. No film. Just clean.
              </p>
            </div>
          </Link>

          {/* Sunscreen */}
          <Link
            href="/products/sunscreen"
            className="group relative overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 transition-transform hover:scale-[1.02]"
          >
            <div className="aspect-square relative">
              <Image
                src="/Sunscreen.png"
                alt="Ordyn daily sunscreen"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-black dark:text-white">Ordyn Daily Sunscreen</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                Weightless SPF for real life — no white cast, no stickiness. Protects without a performance.
              </p>
            </div>
          </Link>
        </div>

        {/* Waitlist disabled for now */}

        {/* Coming Soon Footer */}
        <div className="border-t border-zinc-200 pt-12 dark:border-zinc-800">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-sm text-zinc-400 dark:text-zinc-600">
              <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400 dark:bg-zinc-600"></div>
              <span>Coming soon</span>
            </div>
            <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-500">
              Unveiling something extraordinary. We&apos;ll be live in a few months.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
