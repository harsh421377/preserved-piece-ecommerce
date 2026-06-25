declare module '*.css'

import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ClientLayout } from "@/components/client-layout"

import {
  Inter,
  Cormorant_Garamond,
  Libre_Baskerville as V0_Font_Libre_Baskerville,
  IBM_Plex_Mono as V0_Font_IBM_Plex_Mono,
  Lora as V0_Font_Lora,
} from "next/font/google"

// Initialize fonts
const _libreBaskerville = V0_Font_Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"] })
const _ibmPlexMono = V0_Font_IBM_Plex_Mono({ subsets: ["latin"], weight: ["100","200","300","400","500","600","700"] })
const _lora = V0_Font_Lora({ subsets: ["latin"], weight: ["400","500","600","700"] })

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    template: "%s | Preserved Piece",
    default: "Preserved Piece | Handcrafted Resin Art & Jewelry",
  },
  description:
    "Premium handcrafted resin art, personalized jewelry, custom pendants, bangles, earrings, and home decor. Preserve your precious memories forever in beautiful crystal clear resin.",
  keywords: ["resin jewelry","handcrafted jewelry","personalized pendants","custom jewelry","resin art","preserved flowers","memory jewelry", "luxury resin"],
  openGraph: {
    title: "Preserved Piece | Moments, Preserved Forever",
    description: "Premium handcrafted resin art and personalized jewelry. Preserve your precious memories forever in beautiful crystal clear resin.",
    url: "https://preservedpiece.com",
    siteName: "Preserved Piece",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Preserved Piece | Moments, Preserved Forever",
    description: "Premium handcrafted resin art and personalized jewelry.",
    images: ["/og-image.jpg"],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${cormorant.variable} font-sans antialiased transition-colors duration-300`}>
        {/* ClientLayout conditionally shows Header/Footer only on non-admin pages */}
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  )
}
