import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"



export const metadata = {
  title: "TOPSIS",
  description:"A web application for TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) calculations",
  generator: 'rico rafli abin'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <html lang="en" suppressHydrationWarning>
    <div>
      {children}
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider> */}
      </div>
    // {/* </html> */}
  )
}
