import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'DSS APP',
  description: 'DSS for selecting corn variety',
  generator: 'tim dss - rico - rafli -  abin',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // <html lang="en">
    //   <body>{children}</body>
    // </html>
    <div className={inter.className}>
            {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange> */}
              {children}
              {/* <Toaster /> */}
            {/* </ThemeProvider> */}
          </div>
  )
}
