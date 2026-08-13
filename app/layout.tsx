import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Happy Birthday!',
  description: 'Celebrate with cherished memories and special moments. An interactive birthday celebration page with animations and personalized memories.',
  generator: 'v0.app',
  icons: {
    icon: '/memories/meta-favicon.jpg',
    apple: '/memories/meta-favicon.jpg',
  },
  openGraph: {
    title: 'Happy Birthday!',
    description: 'Celebrate with cherished memories and special moments. An interactive birthday celebration page with animations and personalized memories.',
    images: [
      {
        url: '/memories/meta-favicon.jpg',
        width: 1200,
        height: 630,
        alt: 'Birthday memory preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Happy Birthday!',
    description: 'Celebrate with cherished memories and special moments. An interactive birthday celebration page with animations and personalized memories.',
    images: ['/memories/meta-favicon.jpg'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
