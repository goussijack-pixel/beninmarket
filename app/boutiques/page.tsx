import { createClient } from '@/lib/supabase/server' 
 import Link from 'next/link' 
 import Image from 'next/image' 
 import { MapPin, Store, Search } from 'lucide-react' 
 
 export default async function ListeBoutiquesPage({ 
   searchParams, 
 }: { 
   searchParams: { q?: string; ville?: string } 
 }) { 
   const supabase = await createClient() 
 
   let query = supabase 
     .from('boutiques') 
     .select('*, produits(count)') 
     .eq('statut', 'actif') 
     .order('created_at', { ascending: false }) 
 
   if (searchParams.q) { 
     query = query.ilike('nom', `%${searchParams.q}%`) 
   } 
 
   if (searchParams.ville) { 
     query = query.ilike('ville', `%${searchParams.ville}%`) 
   } 
 
   const { data: boutiques } = await query 
 
   const villes = ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon'] 
 
   return ( 
     <div className="max-w-6xl mx-auto px-4 py-8"> 
 
       {/* Header */} 
       <div className="mb-8"> 
         <h1 className="text-2xl font-bold text-gray-900 mb-2">Toutes les boutiques</h1> 
         <p className="text-gray-500">Découvrez les commerçants béninois sur BéninMarket</p> 
       </div> 
 
       {/* Filtres */} 
       <div className="flex flex-col md:flex-row gap-3 mb-8"> 
         <div className="relative flex-1 max-w-md"> 
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /> 
           <input 
             type="text" 
             placeholder="Rechercher une boutique..." 
             defaultValue={searchParams.q} 
             className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
           /> 
         </div> 
         <div className="flex gap-2 flex-wrap"> 
           <Link href="/boutiques" className={`px-4 py-2 rounded-full text-sm border transition ${!searchParams.ville ? 'bg-primary text-white border-primary' : 'hover:border-primary'}`}> 
             Toutes 
           </Link> 
           {villes.map(ville => ( 
             <Link 
               key={ville} 
               href={`/boutiques?ville=${ville}`} 
               className={`px-4 py-2 rounded-full text-sm border transition ${searchParams.ville === ville ? 'bg-primary text-white border-primary' : 'hover:border-primary'}`} 
             > 
               {ville} 
             </Link> 
           ))} 
         </div> 
       </div> 
 
       {/* Grille boutiques */} 
       {!boutiques || boutiques.length === 0 ? ( 
         <div className="text-center py-20 text-gray-400"> 
           <Store className="w-12 h-12 mx-auto mb-3 opacity-30" /> 
           <p className="text-lg">Aucune boutique trouvée</p> 
         </div> 
       ) : ( 
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"> 
           {boutiques.map((boutique) => ( 
             <Link 
               key={boutique.id} 
               href={`/boutiques/${boutique.slug}`} 
               className="bg-white border rounded-2xl overflow-hidden hover:shadow-md transition group" 
             > 
               {/* Bannière */} 
               <div className="h-24 bg-gradient-to-br from-primary/20 to-orange-100 relative"> 
                 {boutique.banniere_url && ( 
                   <Image src={boutique.banniere_url} alt={boutique.nom} fill className="object-cover" /> 
                 )} 
                 {/* Logo */} 
                 <div className="absolute -bottom-6 left-4 w-12 h-12 bg-white rounded-full border-2 border-white shadow flex items-center justify-center overflow-hidden"> 
                   {boutique.logo_url ? ( 
                     <Image src={boutique.logo_url} alt={boutique.nom} fill className="object-cover" /> 
                   ) : ( 
                     <Store className="text-primary w-6 h-6" /> 
                   )} 
                 </div> 
               </div> 
 
               {/* Infos */} 
               <div className="pt-8 p-4"> 
                 <p className="font-semibold text-gray-900 group-hover:text-primary transition line-clamp-1"> 
                   {boutique.nom} 
                 </p> 
                 {boutique.ville && ( 
                   <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"> 
                     <MapPin className="w-3 h-3" /> {boutique.ville} 
                   </p> 
                 )} 
                 {boutique.description && ( 
                   <p className="text-xs text-gray-500 mt-2 line-clamp-2">{boutique.description}</p> 
                 )} 
               </div> 
             </Link> 
           ))} 
         </div> 
       )} 
     </div> 
   ) 
 } 
