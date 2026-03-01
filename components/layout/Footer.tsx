import Link from 'next/link' 
 import { ShoppingBag } from 'lucide-react' 
 
 export default function Footer() { 
   return ( 
     <footer className="bg-gray-900 text-gray-300 mt-16"> 
       <div className="max-w-6xl mx-auto px-4 py-10"> 
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> 
           
           {/* Logo + description */} 
           <div> 
             <div className="flex items-center gap-2 mb-3"> 
               <ShoppingBag className="text-primary w-6 h-6" /> 
               <span className="font-bold text-white text-lg">BéninMarket</span> 
             </div> 
             <p className="text-sm text-gray-400"> 
               La marketplace made in Bénin. Achetez et vendez facilement avec paiement mobile. 
             </p> 
           </div> 
 
           {/* Liens */} 
           <div> 
             <h3 className="text-white font-semibold mb-3">Navigation</h3> 
             <ul className="space-y-2 text-sm"> 
               <li><Link href="/produits" className="hover:text-white transition">Tous les produits</Link></li> 
               <li><Link href="/boutiques" className="hover:text-white transition">Les boutiques</Link></li> 
               <li><Link href="/inscription" className="hover:text-white transition">Devenir vendeur</Link></li> 
             </ul> 
           </div> 
 
           {/* Contact */} 
           <div> 
             <h3 className="text-white font-semibold mb-3">Contact</h3> 
             <ul className="space-y-2 text-sm"> 
               <li>📍 Cotonou, Bénin</li> 
               <li>📱 WhatsApp : +229 01 69 46 87 80</li> 
               <li>✉️ contact@beninmarket.bj</li> 
             </ul> 
           </div> 
         </div> 
 
         <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500"> 
           © 2024 BéninMarket — Tous droits réservés 
         </div> 
       </div> 
     </footer> 
   ) 
 } 
