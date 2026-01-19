import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Phazur Labs Academy',
    template: '%s | Phazur Labs Academy',
  },
  description:
    'Learn cutting-edge technology skills with Phazur Labs Academy. Expert-led courses in software development, AI, data science, and more.',
  keywords: [
    'online learning',
    'programming courses',
    'software development',
    'AI courses',
    'data science',
    'web development',
    'Phazur Labs',
  ],
  authors: [{ name: 'Phazur Labs' }],
  creator: 'Phazur Labs',
  publisher: 'Phazur Labs Academy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Phazur Labs Academy',
    title: 'Phazur Labs Academy',
    description:
      'Learn cutting-edge technology skills with expert-led courses in software development, AI, data science, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Phazur Labs Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Phazur Labs Academy',
    description:
      'Learn cutting-edge technology skills with expert-led courses in software development, AI, data science, and more.',
    images: ['/og-image.png'],
    creator: '@phazurlabs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--background))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
            },
            success: {
              iconTheme: {
                primary: 'hsl(var(--success))',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: 'hsl(var(--destructive))',
                secondary: 'white',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
