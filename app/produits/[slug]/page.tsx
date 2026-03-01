import { createClient } from '@/lib/supabase/server' 
 import { notFound } from 'next/navigation' 
 import { MessageCircle, MapPin, Store, ArrowLeft } from 'lucide-react' 
 import { Button } from '@/components/ui/button' 
 import Link from 'next/link' 
 import Image from 'next/image' 
 
 export default async function DetailProduitPage({ 
   params, 
 }: { 
   params: Promise<{ slug: string }> 
 }) { 
   const { slug } = await params 
   const supabase = await createClient() 
 
   const { data: produit } = await supabase 
     .from('produits') 
     .select(`*, boutique:boutiques(*)`) 
     .eq('slug', slug) 
     .single() 
 
   if (!produit) notFound() 
 
   const messageWhatsApp = encodeURIComponent( 
     `Bonjour ! Je suis intéressé(e) par votre produit "${produit.nom}" à ${produit.prix.toLocaleString('fr-FR')} FCFA sur BéninMarket. Est-il toujours disponible ?` 
   ) 
 
   const lienWhatsApp = `https://wa.me/${produit.boutique?.whatsapp?.replace(/\D/g, '')}?text=${messageWhatsApp}` 
 
   return ( 
     <div className="max-w-5xl mx-auto px-4 py-8"> 
 
       {/* Retour */} 
       <Link 
         href="/produits" 
         className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6" 
       > 
         <ArrowLeft className="w-4 h-4" /> 
         Retour aux produits 
       </Link> 
 
       <div className="grid grid-cols-1 md:grid-cols-2 gap-10"> 
 
         {/* Images */} 
         <div className="space-y-3"> 
           <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative"> 
             {produit.images && produit.images[0] ? ( 
               <Image 
                 src={produit.images[0]} 
                 alt={produit.nom} 
                 fill 
                 className="object-cover" 
               /> 
             ) : ( 
               <div className="w-full h-full flex items-center justify-center text-7xl"> 
                 🛍️ 
               </div> 
             )} 
           </div> 
 
           {/* Miniatures */} 
           {produit.images && produit.images.length > 1 && ( 
             <div className="flex gap-2 overflow-x-auto"> 
               {produit.images.map((img: string, i: number) => ( 
                 <div key={i} className="relative w-20 h-20 flex-shrink-0"> 
                   <Image 
                     src={img} 
                     alt={`${produit.nom} ${i + 1}`} 
                     fill 
                     className="object-cover rounded-lg border-2 border-transparent hover:border-primary cursor-pointer" 
                   /> 
                 </div> 
               ))} 
             </div> 
           )} 
         </div> 
 
         {/* Infos produit */} 
         <div className="flex flex-col gap-4"> 
           
           {produit.categorie && ( 
             <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full w-fit"> 
               {produit.categorie} 
             </span> 
           )} 
 
           <h1 className="text-2xl font-bold text-gray-900">{produit.nom}</h1> 
 
           <p className="text-3xl font-bold text-primary"> 
             {produit.prix.toLocaleString('fr-FR')} FCFA 
           </p> 
 
           {produit.description && ( 
             <p className="text-gray-600 leading-relaxed">{produit.description}</p> 
           )} 
 
           {/* Bouton WhatsApp */} 
           <a 
             href={lienWhatsApp} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="w-full" 
           > 
             <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg gap-3 rounded-xl"> 
               <MessageCircle className="w-6 h-6" /> 
               Commander via WhatsApp 
             </Button> 
           </a> 
 
           <p className="text-xs text-gray-400 text-center"> 
             Vous serez redirigé vers WhatsApp pour contacter le vendeur 
           </p> 
 
           {/* Infos boutique */} 
           {produit.boutique && ( 
             <div className="border rounded-xl p-4 mt-2"> 
               <div className="flex items-center gap-3 mb-3"> 
                 <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"> 
                   <Store className="text-primary w-5 h-5" /> 
                 </div> 
                 <div> 
                   <p className="font-semibold text-gray-900">{produit.boutique.nom}</p> 
                   {produit.boutique.ville && ( 
                     <p className="text-xs text-gray-400 flex items-center gap-1"> 
                       <MapPin className="w-3 h-3" /> 
                       {produit.boutique.ville} 
                     </p> 
                   )} 
                 </div> 
               </div> 
               <Link href={`/boutiques/${produit.boutique.slug}`}> 
                 <Button variant="outline" className="w-full text-sm"> 
                   Voir la boutique 
                 </Button> 
               </Link> 
             </div> 
           )} 
         </div> 
       </div> 
     </div> 
   ) 
 } 
