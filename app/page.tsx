import Link from 'next/link' 
 import { Search, ShoppingBag, Store, MessageCircle } from 'lucide-react' 
 import { Button } from '@/components/ui/button' 
 
 export default function HomePage() { 
   const categories = [ 
     { nom: 'Mode & Vêtements', icone: '👗', slug: 'mode' }, 
     { nom: 'Électronique', icone: '📱', slug: 'electronique' }, 
     { nom: 'Alimentation', icone: '🍎', slug: 'alimentation' }, 
     { nom: 'Maison & Déco', icone: '🏠', slug: 'maison' }, 
     { nom: 'Beauté & Santé', icone: '💄', slug: 'beaute' }, 
     { nom: 'Agriculture', icone: '🌿', slug: 'agriculture' }, 
     { nom: 'Artisanat', icone: '🎨', slug: 'artisanat' }, 
     { nom: 'Services', icone: '🔧', slug: 'services' }, 
   ] 
 
   return ( 
     <div> 
       {/* Hero */} 
       <section className="bg-gradient-to-br from-primary/10 to-orange-50 py-16 px-4"> 
         <div className="max-w-4xl mx-auto text-center"> 
           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"> 
             La marketplace du 🇧🇯 Bénin 
           </h1> 
           <p className="text-lg text-gray-600 mb-8"> 
             Achetez et vendez facilement. Paiement via MTN MoMo et Moov Money. 
           </p> 
 
           {/* Barre de recherche */} 
           <div className="flex gap-2 max-w-lg mx-auto"> 
             <div className="relative flex-1"> 
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" /> 
               <input 
                 type="text" 
                 placeholder="Que cherchez-vous ?" 
                 className="w-full pl-11 pr-4 py-3 border rounded-full text-base focus:outline-none focus:ring-2 focus:ring-primary shadow-sm" 
               /> 
             </div> 
             <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6"> 
               Chercher 
             </Button> 
           </div> 
         </div> 
       </section> 
 
       {/* Catégories */} 
       <section className="max-w-6xl mx-auto px-4 py-12"> 
         <h2 className="text-2xl font-bold text-gray-900 mb-6"> 
           Parcourir par catégorie 
         </h2> 
         <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4"> 
           {categories.map((cat) => ( 
             <Link 
               key={cat.slug} 
               href={`/produits?categorie=${cat.slug}`} 
               className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border hover:border-primary hover:shadow-md transition group" 
             > 
               <span className="text-3xl">{cat.icone}</span> 
               <span className="text-xs text-center text-gray-600 group-hover:text-primary font-medium"> 
                 {cat.nom} 
               </span> 
             </Link> 
           ))} 
         </div> 
       </section> 
 
       {/* Comment ça marche */} 
       <section className="bg-gray-50 py-12 px-4"> 
         <div className="max-w-4xl mx-auto text-center"> 
           <h2 className="text-2xl font-bold text-gray-900 mb-10"> 
             Comment ça marche ? 
           </h2> 
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> 
             <div className="flex flex-col items-center gap-3"> 
               <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center"> 
                 <Search className="text-primary w-7 h-7" /> 
               </div> 
               <h3 className="font-semibold text-gray-900">1. Cherchez</h3> 
               <p className="text-sm text-gray-500"> 
                 Parcourez des milliers de produits vendus par des commerçants béninois 
               </p> 
             </div> 
             <div className="flex flex-col items-center gap-3"> 
               <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center"> 
                 <MessageCircle className="text-primary w-7 h-7" /> 
               </div> 
               <h3 className="font-semibold text-gray-900">2. Contactez</h3> 
               <p className="text-sm text-gray-500"> 
                 Contactez directement le vendeur via WhatsApp pour commander 
               </p> 
             </div> 
             <div className="flex flex-col items-center gap-3"> 
               <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center"> 
                 <ShoppingBag className="text-primary w-7 h-7" /> 
               </div> 
               <h3 className="font-semibold text-gray-900">3. Recevez</h3> 
               <p className="text-sm text-gray-500"> 
                 Recevez votre commande à Cotonou ou dans votre ville 
               </p> 
             </div> 
           </div> 
         </div> 
       </section> 
 
       {/* CTA Vendeur */} 
       <section className="max-w-4xl mx-auto px-4 py-16 text-center"> 
         <div className="bg-primary rounded-2xl p-10 text-white"> 
           <Store className="w-12 h-12 mx-auto mb-4 opacity-90" /> 
           <h2 className="text-2xl font-bold mb-3"> 
             Vous êtes commerçant ? 
           </h2> 
           <p className="text-white/80 mb-6"> 
             Créez votre boutique gratuite et commencez à vendre en ligne aujourd'hui 
           </p> 
           <Link href="/inscription"> 
             <Button className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-3"> 
               Ouvrir ma boutique gratuitement 
             </Button> 
           </Link> 
         </div> 
       </section> 
     </div> 
   ) 
 } 
