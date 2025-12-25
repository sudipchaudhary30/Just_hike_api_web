import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/_components/Navigation'
import Footer from '@/_components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Just Hike - Your Hiking Companion',
  description: 'Discover amazing trails and connect with fellow hikers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="custom-scrollbar">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}