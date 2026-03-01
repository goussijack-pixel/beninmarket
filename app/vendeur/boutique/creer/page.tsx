'use client' 
 
 import { useState } from 'react' 
 import { useRouter } from 'next/navigation' 
 import { supabase } from '@/lib/supabase/client' 
 import { Button } from '@/components/ui/button' 
 import { Input } from '@/components/ui/input' 
 import { Label } from '@/components/ui/label' 
 import { Store } from 'lucide-react' 
 
 export default function CreerBoutiquePage() { 
   const router = useRouter() 
   const [chargement, setChargement] = useState(false) 
   const [erreur, setErreur] = useState('') 
   const [form, setForm] = useState({ 
     nom: '', 
     description: '', 
     ville: '', 
     quartier: '', 
     telephone: '', 
     whatsapp: '', 
   }) 
 
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { 
     setForm({ ...form, [e.target.name]: e.target.value }) 
   } 
 
   const genererSlug = (nom: string) => { 
     return nom 
       .toLowerCase() 
       .normalize('NFD') 
       .replace(/[\u0300-\u036f]/g, '') 
       .replace(/[^a-z0-9]+/g, '-') 
       .replace(/(^-|-$)/g, '') + '-' + Date.now() 
   } 
 
   const handleSubmit = async (e: React.FormEvent) => { 
     e.preventDefault() 
     setChargement(true) 
     setErreur('') 
 
     const { data: { user } } = await supabase.auth.getUser() 
     if (!user) { router.push('/connexion'); return } 
 
     const { error } = await supabase.from('boutiques').insert({ 
       vendeur_id: user.id, 
       nom: form.nom, 
       slug: genererSlug(form.nom), 
       description: form.description, 
       ville: form.ville, 
       telephone: form.telephone, 
       whatsapp: form.whatsapp, 
     }) 
 
     if (error) { 
       setErreur('Erreur lors de la création. Réessayez.') 
       setChargement(false) 
       return 
     } 
 
     router.push('/vendeur/dashboard') 
   } 
 
   return ( 
     <div className="max-w-xl mx-auto px-4 py-10"> 
       <div className="flex items-center gap-3 mb-8"> 
         <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"> 
           <Store className="text-primary w-5 h-5" /> 
         </div> 
         <div> 
           <h1 className="text-xl font-bold text-gray-900">Créer ma boutique</h1> 
           <p className="text-sm text-gray-400">Remplissez les informations de votre boutique</p> 
         </div> 
       </div> 
 
       {erreur && ( 
         <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{erreur}</div> 
       )} 
 
       <form onSubmit={handleSubmit} className="space-y-5 bg-white border rounded-2xl p-6"> 
         
         <div> 
           <Label htmlFor="nom">Nom de la boutique *</Label> 
           <Input 
             id="nom" 
             name="nom" 
             placeholder="Ex: Boutique Mode Cotonou" 
             value={form.nom} 
             onChange={handleChange} 
             required 
             className="mt-1" 
           /> 
         </div> 
 
         <div> 
           <Label htmlFor="description">Description</Label> 
           <textarea 
             id="description" 
             name="description" 
             placeholder="Décrivez vos produits et services..." 
             value={form.description} 
             onChange={handleChange} 
             rows={3} 
             className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" 
           /> 
         </div> 
 
         <div className="grid grid-cols-2 gap-4"> 
           <div> 
             <Label htmlFor="ville">Ville *</Label> 
             <Input 
               id="ville" 
               name="ville" 
               placeholder="Ex: Cotonou" 
               value={form.ville} 
               onChange={handleChange} 
               required 
               className="mt-1" 
             /> 
           </div> 
           <div> 
             <Label htmlFor="quartier">Quartier</Label> 
             <Input 
               id="quartier" 
               name="quartier" 
               placeholder="Ex: Akpakpa" 
               value={form.quartier} 
               onChange={handleChange} 
               className="mt-1" 
             /> 
           </div> 
         </div> 
 
         <div> 
           <Label htmlFor="telephone">Téléphone</Label> 
           <Input 
             id="telephone" 
             name="telephone" 
             placeholder="Ex: +229 97 00 00 00" 
             value={form.telephone} 
             onChange={handleChange} 
             className="mt-1" 
           /> 
         </div> 
 
         <div> 
           <Label htmlFor="whatsapp">Numéro WhatsApp * <span className="text-gray-400 font-normal">(pour recevoir les commandes)</span></Label> 
           <Input 
             id="whatsapp" 
             name="whatsapp" 
             placeholder="Ex: +22997000000" 
             value={form.whatsapp} 
             onChange={handleChange} 
             required 
             className="mt-1" 
           /> 
           <p className="text-xs text-gray-400 mt-1">Format international : +229XXXXXXXX</p> 
         </div> 
 
         <Button 
           type="submit" 
           className="w-full bg-primary hover:bg-primary/90 text-white py-5" 
           disabled={chargement} 
         > 
           {chargement ? 'Création en cours...' : 'Créer ma boutique'} 
         </Button> 
       </form> 
     </div> 
   ) 
 } 
