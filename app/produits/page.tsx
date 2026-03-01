import { createClient } from '@/lib/supabase/server' 
 import Link from 'next/link' 
 import Image from 'next/image' 
 import { Search } from 'lucide-react' 
 
 export default async function ProduitsPage({ 
   searchParams, 
 }: { 
   searchParams: Promise<{ categorie?: string; q?: string }> 
 }) { 
   const params = await searchParams 
   const supabase = await createClient() 
 
   let query = supabase 
     .from('produits') 
     .select(`*, boutique:boutiques(id, nom, slug, whatsapp, ville)`) 
     .eq('statut', 'actif') 
     .order('created_at', { ascending: false }) 
 
   let nomCategorieAffiche = ''
   if (params.categorie) { 
     const mapCategories: Record<string, string> = { 
       'mode': 'Mode & Vêtements', 
       'electronique': 'Électronique', 
       'alimentation': 'Alimentation', 
       'maison': 'Maison & Déco', 
       'beaute': 'Beauté & Santé', 
       'agriculture': 'Agriculture', 
       'artisanat': 'Artisanat', 
       'services': 'Services', 
       'autre': 'Autre', 
     } 
     nomCategorieAffiche = mapCategories[params.categorie] || params.categorie 
     query = query.eq('categorie', nomCategorieAffiche) 
   } 
 
   if (params.q) { 
     query = query.ilike('nom', `%${params.q}%`) 
   } 
 
   const { data: produits } = await query 
 
   return ( 
     <div className="max-w-6xl mx-auto px-4 py-8"> 
       
       {/* Titre + recherche */} 
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"> 
         <h1 className="text-2xl font-bold text-gray-900"> 
           {nomCategorieAffiche 
             ? `Catégorie : ${nomCategorieAffiche}` 
             : params.q 
             ? `Résultats pour "${params.q}"` 
             : 'Tous les produits'} 
         </h1> 
         <div className="relative max-w-sm w-full"> 
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /> 
           <input 
             type="text" 
             placeholder="Rechercher..." 
             defaultValue={params.q} 
             className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
           /> 
         </div> 
       </div> 
 
       {/* Grille produits */} 
       {!produits || produits.length === 0 ? ( 
         <div className="text-center py-20 text-gray-400"> 
           <p className="text-lg">Aucun produit trouvé</p> 
           <p className="text-sm mt-2">Revenez bientôt, de nouveaux produits arrivent !</p> 
         </div> 
       ) : ( 
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"> 
           {produits.map((produit) => ( 
             <Link 
               key={produit.id} 
               href={`/produits/${produit.slug}`} 
               className="bg-white rounded-xl border hover:shadow-md transition overflow-hidden group" 
             > 
               {/* Image */} 
               <div className="aspect-square bg-gray-100 overflow-hidden relative"> 
                 {produit.images && produit.images[0] ? ( 
                   <Image 
                     src={produit.images[0]} 
                     alt={produit.nom} 
                     fill 
                     className="object-cover group-hover:scale-105 transition duration-300" 
                   /> 
                 ) : ( 
                   <div className="w-full h-full flex items-center justify-center text-4xl"> 
                     🛍️ 
                   </div> 
                 )} 
               </div> 
 
               {/* Infos */} 
               <div className="p-3"> 
                 <p className="text-sm font-medium text-gray-900 line-clamp-2"> 
                   {produit.nom} 
                 </p> 
                 <p className="text-primary font-bold mt-1"> 
                   {produit.prix.toLocaleString('fr-FR')} FCFA 
                 </p> 
                 {produit.boutique && ( 
                   <p className="text-xs text-gray-400 mt-1"> 
                     📍 {produit.boutique.ville || 'Bénin'} 
                   </p> 
                 )} 
               </div> 
             </Link> 
           ))} 
         </div> 
       )} 
     </div> 
   ) 
 } 
