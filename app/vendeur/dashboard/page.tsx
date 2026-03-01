'use client' 
 
 import { useEffect, useState } from 'react' 
 import { useRouter } from 'next/navigation' 
 import Link from 'next/link' 
 import { supabase } from '@/lib/supabase/client' 
 import { Button } from '@/components/ui/button' 
 import { Store, Package, Plus, LogOut } from 'lucide-react' 
 
 export default function DashboardVendeur() { 
   const router = useRouter() 
   const [boutique, setBoutique] = useState<any>(null) 
   const [produits, setProduits] = useState<any[]>([]) 
   const [chargement, setChargement] = useState(true) 
 
   useEffect(() => { 
     const chargerDonnees = async () => { 
       const { data: { user } } = await supabase.auth.getUser() 
       
       if (!user) { 
         router.push('/connexion') 
         return 
       } 
 
       // Vérifier le rôle 
       const { data: profile } = await supabase 
         .from('profiles') 
         .select('role') 
         .eq('id', user.id) 
         .single() 
 
       if (profile?.role !== 'vendeur') { 
         router.push('/') 
         return 
       } 
 
       // Charger la boutique 
       const { data: boutiqueData } = await supabase 
         .from('boutiques') 
         .select('*') 
         .eq('vendeur_id', user.id) 
         .single() 
 
       setBoutique(boutiqueData) 
 
       // Charger les produits si boutique existe 
       if (boutiqueData) { 
         const { data: produitsData } = await supabase 
           .from('produits') 
           .select('*') 
           .eq('boutique_id', boutiqueData.id) 
           .order('created_at', { ascending: false }) 
 
         setProduits(produitsData || []) 
       } 
 
       setChargement(false) 
     } 
 
     chargerDonnees() 
   }, [router]) 
 
   const handleDeconnexion = async () => { 
     await supabase.auth.signOut() 
     router.push('/') 
   } 
 
   if (chargement) { 
     return ( 
       <div className="min-h-screen flex items-center justify-center"> 
         <p className="text-gray-400">Chargement...</p> 
       </div> 
     ) 
   } 
 
   return ( 
     <div className="max-w-5xl mx-auto px-4 py-8"> 
       
       {/* Header dashboard */} 
       <div className="flex items-center justify-between mb-8"> 
         <h1 className="text-2xl font-bold text-gray-900">Mon espace vendeur</h1> 
         <Button variant="ghost" onClick={handleDeconnexion} className="gap-2 text-gray-500"> 
           <LogOut className="w-4 h-4" /> 
           Déconnexion 
         </Button> 
       </div> 
 
       {/* Pas de boutique encore */} 
       {!boutique ? ( 
         <div className="bg-orange-50 border border-orange-200 rounded-2xl p-10 text-center"> 
           <Store className="w-12 h-12 text-primary mx-auto mb-4" /> 
           <h2 className="text-xl font-bold text-gray-900 mb-2"> 
             Créez votre boutique 
           </h2> 
           <p className="text-gray-500 mb-6"> 
             Avant d'ajouter des produits, configurez votre boutique 
           </p> 
           <Link href="/vendeur/boutique/creer"> 
             <Button className="bg-primary hover:bg-primary/90 text-white px-8"> 
               Créer ma boutique 
             </Button> 
           </Link> 
         </div> 
       ) : ( 
         <> 
           {/* Infos boutique */} 
           <div className="bg-white border rounded-xl p-5 mb-6 flex items-center justify-between"> 
             <div className="flex items-center gap-4"> 
               <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"> 
                 <Store className="text-primary w-6 h-6" /> 
               </div> 
               <div> 
                 <p className="font-semibold text-gray-900">{boutique.nom}</p> 
                 <p className="text-sm text-gray-400">{boutique.ville} · {produits.length} produit(s)</p> 
               </div> 
             </div> 
             <Link href="/vendeur/boutique/modifier"> 
               <Button variant="outline" size="sm">Modifier</Button> 
             </Link> 
           </div> 
 
           {/* Actions rapides */} 
           <div className="flex items-center justify-between mb-4"> 
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2"> 
               <Package className="w-5 h-5" /> 
               Mes produits ({produits.length}) 
             </h2> 
             <Link href="/vendeur/produits/nouveau"> 
               <Button className="bg-primary hover:bg-primary/90 text-white gap-2"> 
                 <Plus className="w-4 h-4" /> 
                 Ajouter un produit 
               </Button> 
             </Link> 
           </div> 
 
           {/* Liste produits */} 
           {produits.length === 0 ? ( 
             <div className="text-center py-16 text-gray-400 border rounded-xl"> 
               <p>Vous n'avez pas encore de produits</p> 
               <Link href="/vendeur/produits/nouveau"> 
                 <Button className="mt-4 bg-primary text-white"> 
                   Ajouter mon premier produit 
                 </Button> 
               </Link> 
             </div> 
           ) : ( 
             <div className="space-y-3"> 
               {produits.map((produit) => ( 
                 <div key={produit.id} className="bg-white border rounded-xl p-4 flex items-center justify-between"> 
                   <div className="flex items-center gap-4"> 
                     <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"> 
                       {produit.images?.[0] ? ( 
                         <img src={produit.images[0]} alt={produit.nom} className="w-full h-full object-cover" /> 
                       ) : ( 
                         <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div> 
                       )} 
                     </div> 
                     <div> 
                       <p className="font-medium text-gray-900">{produit.nom}</p> 
                       <p className="text-primary font-bold text-sm"> 
                         {produit.prix.toLocaleString('fr-FR')} FCFA 
                       </p> 
                       {/* Badge stock */} 
                       {produit.stock_illimite ? ( 
                         <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium"> 
                           Stock illimité 
                         </span> 
                       ) : produit.stock === 0 ? ( 
                         <span className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded-full font-medium"> 
                           Rupture de stock 
                         </span> 
                       ) : ( 
                         <span className="text-[10px] text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full font-medium"> 
                           {produit.stock} en stock 
                         </span> 
                       )} 
                     </div> 
                   </div> 
                   <div className="flex gap-2"> 
                     <Link href={`/vendeur/produits/${produit.id}/modifier`}> 
                       <Button variant="outline" size="sm">Modifier</Button> 
                     </Link> 
                   </div> 
                 </div> 
               ))} 
             </div> 
           )} 
         </> 
       )} 
     </div> 
   ) 
 } 
