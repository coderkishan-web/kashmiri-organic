import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kashmiri Organic | Premium Saffron, Wild Forest Honey & Heritage Walnut Crafts",
    template: "%s | Kashmiri Organic"
  },
  description: "Discover the authentic luxury of the Kashmir Valley. Sourcing hand-harvested Grade A+ Pampore Saffron, organic raw forest honey, cold-pressed seed oils, and sustainable heritage woodcraft.",
  keywords: ["kashmiri saffron", "mongra saffron", "organic forest honey", "walnut wood bowl", "cold pressed walnut oil", "himalayan herbs", "premium organic b2b", "kashmir export quality"],
  authors: [{ name: "Kashmiri Organic Team" }],
  metadataBase: new URL("https://kashmiriorganic.com"),
  openGraph: {
    title: "Kashmiri Organic | Premium Spices, Honey & Artistry",
    description: "Experience the pure, sustainable botanical treasures of Kashmir. Hand-harvested, ethically sourced, and globally certified organic products.",
    url: "https://kashmiriorganic.com",
    siteName: "Kashmiri Organic",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-cream text-text-primary">
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
