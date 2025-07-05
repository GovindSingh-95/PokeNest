import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PokéNest - Your Cozy Pokémon Home",
  description:
    "A beautiful, comprehensive Pokédex with battle simulators, team builders, and more. Explore all Pokémon from every region with authentic data from PokéAPI.",
  keywords: ["pokemon", "pokedex", "battle", "team builder", "pokemon stats", "pokemon types"],
  authors: [{ name: "PokéNest Team" }],
  creator: "PokéNest",
  publisher: "PokéNest",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://pokenest.vercel.app"),
  openGraph: {
    title: "PokéNest - Your Cozy Pokémon Home",
    description: "A beautiful, comprehensive Pokédex with battle simulators, team builders, and more.",
    url: "https://pokenest.vercel.app",
    siteName: "PokéNest",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PokéNest - Your Cozy Pokémon Home",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PokéNest - Your Cozy Pokémon Home",
    description: "A beautiful, comprehensive Pokédex with battle simulators, team builders, and more.",
    images: ["/og-image.png"],
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
  verification: {
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </body>
    </html>
  )
}
