import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Roboto({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: "100,700"
})

export const metadata: Metadata = {
  title: "MCYHM - Interactive Experience",
  description: "An immersive storytelling experience",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
