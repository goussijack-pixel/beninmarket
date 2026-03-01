import { createClient } from '@/lib/supabase/server' 
 import { notFound } from 'next/navigation' 
 import Link from 'next/link' 
 import Image from 'next/image' 
 import BoutonCopierLien from '@/components/shared/BoutonCopierLien' 
 import { MapPin, Phone, MessageCircle, Store, ArrowLeft } from 'lucide-react' 
 import { Button } from '@/components/ui/button' 
 
 export default async function PageBoutique({ 
   params, 
 }: { 
   params: Promise<{ slug: string }> 
 }) { 
   const { slug } = await params 
   const supabase = await createClient() 
 
   const { data: boutique } = await supabase 
     .from('boutiques') 
     .select('*') 
     .eq('slug', slug) 
     .single() 
 
   if (!boutique) notFound() 
 
   const { data: produits } = await supabase 
     .from('produits') 
     .select('*') 
     .eq('boutique_id', boutique.id) 
     .eq('statut', 'actif') 
     .order('created_at', { ascending: false }) 
 
   const messageWhatsApp = encodeURIComponent( 
     `Bonjour ! J'ai visité votre boutique "${boutique.nom}" sur BéninMarket et j'aimerais avoir plus d'informations.` 
   ) 
   const lienWhatsApp = `https://wa.me/${boutique.whatsapp?.replace(/\D/g, '')}?text=${messageWhatsApp}` 
 
   return ( 
     <div className="max-w-5xl mx-auto px-4 py-8"> 
 
       {/* Retour */} 
       <Link href="/produits" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6"> 
         <ArrowLeft className="w-4 h-4" /> 
         Retour aux produits 
       </Link> 
 
       {/* Header boutique */} 
       <div className="bg-white border rounded-2xl p-6 mb-8"> 
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4"> 
           <div className="flex items-center gap-4"> 
             <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden"> 
               {boutique.logo_url ? ( 
                 <Image src={boutique.logo_url} alt={boutique.nom} fill className="object-cover" /> 
               ) : ( 
                 <Store className="text-primary w-8 h-8" /> 
               )} 
             </div> 
             <div> 
               <h1 className="text-2xl font-bold text-gray-900">{boutique.nom}</h1> 
               <div className="flex flex-wrap gap-3 mt-1"> 
                 {boutique.ville && ( 
                   <span className="text-sm text-gray-500 flex items-center gap-1"> 
                     <MapPin className="w-3 h-3" /> {boutique.ville} 
                   </span> 
                 )} 
                 {boutique.telephone && ( 
                   <span className="text-sm text-gray-500 flex items-center gap-1"> 
                     <Phone className="w-3 h-3" /> {boutique.telephone} 
                   </span> 
                 )} 
               </div> 
             </div> 
           </div> 
 
           {/* Boutons d'action */} 
           <div className="flex flex-wrap gap-2 w-full md:w-auto"> 
             <BoutonCopierLien slug={slug} /> 
             
             {boutique.whatsapp && ( 
               <a href={lienWhatsApp} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-initial"> 
                 <Button className="bg-green-500 hover:bg-green-600 text-white gap-2 w-full"> 
                   <MessageCircle className="w-4 h-4" /> 
                   WhatsApp 
                 </Button> 
               </a> 
             )} 
           </div> 
         </div> 
 
         {boutique.description && ( 
           <p className="text-gray-600 mt-4 text-sm leading-relaxed border-t pt-4"> 
             {boutique.description} 
           </p> 
         )} 
       </div> 
 
       {/* Produits */} 
       <h2 className="text-xl font-bold text-gray-900 mb-4"> 
         Produits ({produits?.length || 0}) 
       </h2> 
 
       {!produits || produits.length === 0 ? ( 
         <div className="text-center py-16 text-gray-400 border rounded-xl"> 
           <p>Cette boutique n'a pas encore de produits</p> 
         </div> 
       ) : ( 
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> 
           {produits.map((produit) => ( 
             <Link 
               key={produit.id} 
               href={`/produits/${produit.slug}`} 
               className="bg-white rounded-xl border hover:shadow-md transition overflow-hidden group" 
             > 
               <div className="aspect-square bg-gray-100 overflow-hidden relative"> 
                 {produit.images?.[0] ? ( 
                   <Image 
                     src={produit.images[0]} 
                     alt={produit.nom} 
                     fill 
                     className="object-cover group-hover:scale-105 transition duration-300" 
                   /> 
                 ) : ( 
                   <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div> 
                 )} 
               </div> 
               <div className="p-3"> 
                 <p className="text-sm font-medium text-gray-900 line-clamp-2">{produit.nom}</p> 
                 <p className="text-primary font-bold mt-1"> 
                   {produit.prix.toLocaleString('fr-FR')} FCFA 
                 </p> 
               </div> 
             </Link> 
           ))} 
         </div> 
       )} 
     </div> 
   ) 
 } 
