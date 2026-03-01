import type { Metadata } from 'next' 
 import { Geist } from 'next/font/google' 
 import './globals.css' 
 import Header from '@/components/layout/Header' 
 import Footer from '@/components/layout/Footer' 
 
 const geist = Geist({ subsets: ['latin'] }) 
 
 export const metadata: Metadata = { 
   title: 'BéninMarket — La marketplace du Bénin', 
   description: 'Achetez et vendez facilement au Bénin avec paiement mobile money', 
 } 
 
 export default function RootLayout({ 
   children, 
 }: { 
   children: React.ReactNode 
 }) { 
   return ( 
     <html lang="fr"> 
       <body className={geist.className}> 
         <Header /> 
         <main className="min-h-screen"> 
           {children} 
         </main> 
         <Footer /> 
       </body> 
     </html> 
   ) 
 } 
