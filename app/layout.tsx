import { Inter, Jura } from 'next/font/google'
import './globals.css'
import Navigation from '@/_components/Navigation'
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
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0f172a',
                color: '#ffffff',
                border: '1px solid #45D1C1',
                borderRadius: '12px',
                padding: '12px 14px',
                fontWeight: '600',
              },
              success: {
                iconTheme: {
                  primary: '#45D1C1',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#45D1C1',
                  secondary: '#ffffff',
                },
              },
            }}
          />
          <Navigation />
          <main className="flex-grow">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}