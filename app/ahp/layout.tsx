import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
// import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AHP for decision making",
  description: "Analytic Hierarchy Process (AHP) for decision making",
    generator: 'rico rafli abin'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // <html lang="en">
      <div className={inter.className}>{children}</div>
    // </html>
  )
}
