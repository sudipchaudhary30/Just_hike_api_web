import { Inter, Jura } from 'next/font/google'
import './globals.css'
import Navigation from '@/_components/Navigation'
import Footer from '@/_components/Footer'
import { AuthProvider } from '@/_components/auth/AuthProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })
const jura = Jura({ subsets: ['latin'], variable: '--font-jura' })

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
    <html lang="en" className={`custom-scrollbar ${jura.variable}`}>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          <Toaster position="top-right" />
          <Navigation />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}