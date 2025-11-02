import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Provider from "./provider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ordyn Soap - unveil.skin",
  description: "Ordyn. From ordinary to extraordinary. Coming soon.",
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
      </body>
    </html>
  );
}
