import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
