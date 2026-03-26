import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Designer Furnished Rooms in Bangalore · From ₹30k/month · flent',
  description:
    'Private, fully furnished rooms in curated designer homes. For working professionals. Not a PG. Not coliving. From ₹30,000/month. Bangalore.',
}

export const viewport: Viewport = {
  themeColor: '#008E75',
  width: 'device-width',
  initialScale: 1,
}

export default function HomeConciergeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={`${playfair.variable} ${jakarta.variable} font-sans antialiased`}>
      {children}
    </div>
  )
}
