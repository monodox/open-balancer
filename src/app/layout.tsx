import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { CookieConsent } from '@/components/ui/cookie-consent'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'open-Balancer',
  description: 'Adaptive control layer for Gemini-powered LLM applications with AI brownout strategies',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}