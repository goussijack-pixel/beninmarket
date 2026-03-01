'use client' 
 
 import Link from 'next/link' 
 import { ShoppingBag, Menu, X, Search } from 'lucide-react' 
 import { useState } from 'react' 
 import { Button } from '@/components/ui/button' 
 
 export default function Header() { 
   const [menuOuvert, setMenuOuvert] = useState(false) 
 
   return ( 
     <header className="sticky top-0 z-50 bg-white border-b shadow-sm"> 
       <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between"> 
         
         {/* Logo */} 
         <Link href="/" className="flex items-center gap-2"> 
           <ShoppingBag className="text-primary w-7 h-7" /> 
           <span className="font-bold text-xl text-primary">BéninMarket</span> 
         </Link> 
 
         <nav className="hidden md:flex items-center gap-6 text-sm font-medium"> 
           <Link href="/produits" className="text-gray-600 hover:text-primary transition"> 
             Produits 
           </Link> 
           <Link href="/boutiques" className="text-gray-600 hover:text-primary transition"> 
             Boutiques 
           </Link> 
         </nav> 
 
         {/* Barre de recherche - desktop */} 
         <div className="hidden md:flex flex-1 max-w-md mx-8"> 
           <div className="relative w-full"> 
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /> 
             <input 
               type="text" 
               placeholder="Rechercher un produit..." 
               className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
             /> 
           </div> 
         </div> 
 
         {/* Actions - desktop */} 
         <div className="hidden md:flex items-center gap-3"> 
           <Link href="/connexion"> 
             <Button variant="ghost" size="sm">Connexion</Button> 
           </Link> 
           <Link href="/inscription"> 
             <Button size="sm" className="bg-primary hover:bg-primary/90 text-white"> 
               Vendre 
             </Button> 
           </Link> 
         </div> 
 
         {/* Menu burger - mobile */} 
         <button 
           className="md:hidden p-2" 
           onClick={() => setMenuOuvert(!menuOuvert)} 
         > 
           {menuOuvert ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />} 
         </button> 
       </div> 
 
       {/* Menu mobile */} 
       {menuOuvert && ( 
         <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-3"> 
           <div className="relative"> 
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /> 
             <input 
               type="text" 
               placeholder="Rechercher un produit..." 
               className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
             /> 
           </div> 
           <Link href="/produits" onClick={() => setMenuOuvert(false)} className="text-gray-700 font-medium py-2"> 
             Produits 
           </Link> 
           <Link href="/boutiques" onClick={() => setMenuOuvert(false)} className="text-gray-700 font-medium py-2"> 
             Boutiques 
           </Link> 
           <Link href="/connexion" onClick={() => setMenuOuvert(false)}> 
             <Button variant="ghost" className="w-full">Connexion</Button> 
           </Link> 
           <Link href="/inscription" onClick={() => setMenuOuvert(false)}> 
             <Button className="w-full bg-primary hover:bg-primary/90 text-white"> 
               Devenir vendeur 
             </Button> 
           </Link> 
         </div> 
       )} 
     </header> 
   ) 
 } 
