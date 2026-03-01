import { createClient } from '@/lib/supabase/server' 
 import { notFound } from 'next/navigation' 
 import Link from 'next/link' 
 import Image from 'next/image' 
 import BoutonCopierLien from '@/components/shared/BoutonCopierLien' 
 import BoutonAjouterPanier from '@/components/panier/BoutonAjouterPanier' 
 import { MapPin, Phone, MessageCircle, Store, ArrowLeft } from 'lucide-react' 
 import { Button } from '@/components/ui/button' 
 import { Metadata } from 'next' 
 
 export async function generateMetadata({ 
   params, 
 }: { 
   params: Promise<{ slug: string }> 
 }): Promise<Metadata> { 
   const { slug } = await params 
   const supabase = await createClient() 
 
   const { data: boutique } = await supabase 
     .from('boutiques') 
     .select('nom, description, statut') 
     .eq('slug', slug) 
     .single() 
 
   if (!boutique || boutique.statut !== 'actif') return { title: 'Boutique non trouvée' } 
 
   return { 
     title: `${boutique.nom} | BéninMarket`, 
     description: boutique.description || `Découvrez les produits de ${boutique.nom} sur BéninMarket.`, 
     openGraph: { 
       title: boutique.nom, 
       description: boutique.description || `Visitez ma boutique sur BéninMarket.`, 
       type: 'website', 
     } 
   } 
 } 
 
 export default async function PageBoutique({ 
   params, 
   searchParams, 
 }: { 
   params: Promise<{ slug: string }> 
   searchParams: Promise<{ categorie?: string }> 
 }) { 
   const { slug } = await params 
   const { categorie } = await searchParams 
   const supabase = await createClient() 
 
   const { data: boutique, error } = await supabase 
     .from('boutiques') 
     .select('*') 
     .eq('slug', slug) 
     .single() 
 
   if (error || !boutique) notFound() 
   if (boutique.statut !== 'actif') notFound() 
 
   // Récupérer toutes les catégories uniques des produits de cette boutique 
   const { data: toutesCategories, error: errorCategories } = await supabase 
     .from('produits') 
     .select('categorie') 
     .eq('boutique_id', boutique.id) 
     .eq('statut', 'actif') 
 
   if (errorCategories) { 
     console.error('Erreur chargement catégories:', errorCategories) 
   } 
 
   const categoriesUniques = Array.from( 
     new Set(toutesCategories?.map((p) => p.categorie).filter(Boolean)) 
   ).sort() 
 
   // Construire la requête des produits 
   let query = supabase 
     .from('produits') 
     .select('*') 
     .eq('boutique_id', boutique.id) 
     .eq('statut', 'actif') 
 
   if (categorie) { 
     query = query.eq('categorie', categorie) 
   } 
 
   const { data: produits, error: errorProduits } = await query.order('created_at', { ascending: false }) 
 
   if (errorProduits) { 
     console.error('Erreur chargement produits:', errorProduits) 
   } 
 
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
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"> 
         <h2 className="text-xl font-bold text-gray-900"> 
           {categorie ? `Produits - ${categorie}` : 'Tous les produits'} ({produits?.length || 0}) 
         </h2> 
 
         {/* Filtres par catégorie */} 
         {categoriesUniques.length > 0 && ( 
           <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar"> 
             <Link 
               href={`/boutiques/${slug}`} 
               className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition ${ 
                 !categorie  
                   ? 'bg-primary text-white border-primary'  
                   : 'bg-white text-gray-600 hover:border-primary' 
               }`} 
             > 
               Tous 
             </Link> 
             {categoriesUniques.map((cat) => ( 
               <Link 
                 key={cat} 
                 href={`/boutiques/${slug}?categorie=${encodeURIComponent(cat)}`} 
                 className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition ${ 
                   categorie === cat 
                     ? 'bg-primary text-white border-primary'  
                     : 'bg-white text-gray-600 hover:border-primary' 
                 }`} 
               > 
                 {cat} 
               </Link> 
             ))} 
           </div> 
         )} 
       </div> 
 
       {!produits || produits.length === 0 ? ( 
         <div className="text-center py-16 text-gray-400 border rounded-xl"> 
           <p>Cette boutique n'a pas encore de produits</p> 
         </div> 
       ) : ( 
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> 
           {produits.map((produit) => { 
             const produitAvecBoutique = { ...produit, boutique } 
             return ( 
               <Link 
                 key={produit.id} 
                 href={`/produits/${produit.slug}`} 
                 className="bg-white rounded-xl border hover:shadow-md transition overflow-hidden group flex flex-col" 
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
                 <div className="p-3 flex-1 flex flex-col"> 
                   <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{produit.nom}</p> 
                   <p className="text-primary font-bold mb-3"> 
                     {produit.prix.toLocaleString('fr-FR')} FCFA 
                   </p> 
                   <div className="mt-auto pt-2 border-t border-gray-50"> 
                     <BoutonAjouterPanier produit={produitAvecBoutique} fullWidth /> 
                   </div> 
                 </div> 
               </Link> 
             ) 
           })} 
         </div> 
       )} 
     </div> 
   ) 
 } 
