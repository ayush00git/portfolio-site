import type { Metadata } from 'next'
import { JetBrains_Mono, Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Ayush Kumar',
  description: 'Portfolio of Ayush Kumar, Computer Science student, systems programmer, and Apache Committer.',
  icons: { icon: '/favicon.png' },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable} ${instrumentSerif.variable}`}>
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  )
}
