import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Provider from "./provider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "unveil.skin | Unveil Your Real Skin",
  description:
    "Meet ORDYN by unveil.skin: dermatologist-formulated soap bar and daily sunscreen that reveal your real skin with gentle clarity and invisible protection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <Provider>{children}</Provider>
        <Analytics />
      </body>
    </html>
  );
}
