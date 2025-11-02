import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Ordyn Soap Bar - unveil.skin",
  description: "Gentle, fragrance-light cleanse for everyday skin. No fuss. No film. Just clean.",
};

export default function SoapBarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-black dark:via-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">
              unveil<span className="text-zinc-400 dark:text-zinc-600">.skin</span>
            </h1>
          </Link>
        </div>
      </header>

      {/* Product Content */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        {/* Back Link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to products
        </Link>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900">
            <Image
              src="/Soap_bar.png"
              alt="Ordyn soap bar"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <div className="mb-4">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                ORDYN
              </span>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-black dark:text-white sm:text-5xl">
                Soap Bar
              </h1>
            </div>

            <p className="mb-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Gentle, fragrance-light cleanse for everyday skin. No fuss. No film. Just clean.
            </p>

            {/* Features */}
            <div className="mb-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                <div>
                  <h3 className="font-medium text-black dark:text-white">
                    Gentle formulation
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Formulated for daily use without stripping your skin&apos;s natural balance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                <div>
                  <h3 className="font-medium text-black dark:text-white">
                    Fragrance-light
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Subtle, natural scent that won&apos;t overwhelm your senses.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                <div>
                  <h3 className="font-medium text-black dark:text-white">
                    No residue
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Rinses clean without leaving any film or sticky feeling behind.
                  </p>
                </div>
              </div>
            </div>

            {/* Coming Soon Notice */}
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-zinc-400 dark:bg-zinc-600" />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Coming soon
                </span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-500">
                We&apos;re putting the finishing touches on ORDYN. Available in a few months.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
