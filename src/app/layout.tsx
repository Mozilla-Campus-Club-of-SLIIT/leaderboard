import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SLIIT Mozilla Github Leaderboard",
  description: "Spotlight on the most active contributors to the Mozilla Campus Club of SLIIT",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col overflow-x-hidden bg-white text-black antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
