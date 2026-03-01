import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { PanierProvider } from '@/components/panier/PanierContext'
import PanierFlottant from '@/components/panier/PanierFlottant'
import { Toaster } from '@/components/ui/sonner'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BéninMarket — La marketplace premium du Bénin',
  description: 'Achetez et vendez facilement au Bénin avec paiement MTN MoMo & Moov Money',
  keywords: ['marketplace', 'bénin', 'achat', 'vente', 'cotonou', 'mobile money'],
  openGraph: {
    title: 'BéninMarket — La marketplace premium du Bénin',
    description: 'Achetez et vendez facilement au Bénin',
    type: 'website',
    locale: 'fr_BJ',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased`}>
        <PanierProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <PanierFlottant />
          <Toaster
            theme="dark"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                border: '1px solid rgba(251,191,36,0.2)',
                color: '#fff',
              },
            }}
          />
        </PanierProvider>
      </body>
    </html>
  )
}