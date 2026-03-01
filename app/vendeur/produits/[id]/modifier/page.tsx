'use client' 
 
 import { useState, useEffect } from 'react' 
 import { useRouter, useParams } from 'next/navigation' 
 import { supabase } from '@/lib/supabase/client' 
 import { Button } from '@/components/ui/button' 
 import { Input } from '@/components/ui/input' 
 import { Label } from '@/components/ui/label' 
 import { Package, Upload, X, Trash2 } from 'lucide-react' 
 import Image from 'next/image' 
 
 const CATEGORIES = [ 
   'Mode & Vêtements', 'Électronique', 'Alimentation', 
   'Maison & Déco', 'Beauté & Santé', 'Agriculture', 
   'Artisanat', 'Services', 'Autre' 
 ] 
 
 export default function ModifierProduitPage() { 
   const router = useRouter() 
   const params = useParams() 
   const produitId = params.id as string 
 
   const [chargement, setChargement] = useState(true) 
   const [sauvegarde, setSauvegarde] = useState(false) 
   const [erreur, setErreur] = useState('') 
   const [imagesExistantes, setImagesExistantes] = useState<string[]>([]) 
   const [nouvellesImages, setNouvellesImages] = useState<File[]>([]) 
   const [previews, setPreviews] = useState<string[]>([]) 
   const [form, setForm] = useState({ 
     nom: '', 
     description: '', 
     prix: '', 
     categorie: '', 
     statut: 'actif', 
     stock: '0', 
     stock_illimite: false, 
   }) 
 
   useEffect(() => { 
     const chargerProduit = async () => { 
       const { data: produit } = await supabase 
         .from('produits') 
         .select('*') 
         .eq('id', produitId) 
         .single() 
 
       if (produit) { 
         setForm({ 
           nom: produit.nom, 
           description: produit.description || '', 
           prix: produit.prix.toString(), 
           categorie: produit.categorie || '', 
           statut: produit.statut, 
           stock: produit.stock?.toString() || '0', 
           stock_illimite: produit.stock_illimite || false, 
         }) 
         setImagesExistantes(produit.images || []) 
       } 
       setChargement(false) 
     } 
     chargerProduit() 
   }, [produitId]) 
 
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { 
     setForm({ ...form, [e.target.name]: e.target.value }) 
   } 
 
   const supprimerImageExistante = (index: number) => { 
     setImagesExistantes(imagesExistantes.filter((_, i) => i !== index)) 
   } 
 
   const handleNouvellesImages = (e: React.ChangeEvent<HTMLInputElement>) => { 
     const files = Array.from(e.target.files || []) 
     const total = imagesExistantes.length + nouvellesImages.length + files.length 
     if (total > 4) { setErreur('Maximum 4 images au total'); return } 
     setNouvellesImages([...nouvellesImages, ...files]) 
     setPreviews([...previews, ...files.map(f => URL.createObjectURL(f))]) 
   } 
 
   const supprimerNouvelleImage = (index: number) => { 
     setNouvellesImages(nouvellesImages.filter((_, i) => i !== index)) 
     setPreviews(previews.filter((_, i) => i !== index)) 
   } 
 
   const uploadImages = async (boutiqueId: string): Promise<string[]> => { 
     const urls: string[] = [] 
     for (const image of nouvellesImages) { 
       const nomFichier = `${boutiqueId}/${Date.now()}-${image.name}` 
       const { data, error } = await supabase.storage.from('produits').upload(nomFichier, image) 
       if (!error && data) { 
         const { data: urlData } = supabase.storage.from('produits').getPublicUrl(data.path) 
         urls.push(urlData.publicUrl) 
       } 
     } 
     return urls 
   } 
 
   const handleSubmit = async (e: React.FormEvent) => { 
     e.preventDefault() 
     setSauvegarde(true) 
     setErreur('') 
 
     const { data: { user } } = await supabase.auth.getUser() 
     if (!user) { router.push('/connexion'); return } 
 
     const { data: boutique } = await supabase 
       .from('boutiques') 
       .select('id') 
       .eq('vendeur_id', user.id) 
       .single() 
 
     if (!boutique) { setErreur('Boutique introuvable'); setSauvegarde(false); return } 
 
     const nouvellesUrls = await uploadImages(boutique.id) 
     const toutesImages = [...imagesExistantes, ...nouvellesUrls] 
 
     const { error } = await supabase 
         .from('produits') 
         .update({ 
           nom: form.nom, 
           description: form.description, 
           prix: parseInt(form.prix), 
           categorie: form.categorie, 
           statut: form.statut, 
           images: toutesImages, 
           stock: form.stock_illimite ? null : parseInt(form.stock), 
           stock_illimite: form.stock_illimite, 
         }) 
         .eq('id', produitId) 
 
     if (error) { setErreur('Erreur lors de la sauvegarde'); setSauvegarde(false); return } 
 
     router.push('/vendeur/dashboard') 
   } 
 
   const handleSupprimer = async () => { 
     if (!confirm('Supprimer ce produit définitivement ?')) return 
     await supabase.from('produits').delete().eq('id', produitId) 
     router.push('/vendeur/dashboard') 
   } 
 
   if (chargement) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Chargement...</p></div> 
 
   return ( 
     <div className="max-w-xl mx-auto px-4 py-10"> 
       <div className="flex items-center justify-between mb-8"> 
         <div className="flex items-center gap-3"> 
           <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"> 
             <Package className="text-primary w-5 h-5" /> 
           </div> 
           <div> 
             <h1 className="text-xl font-bold text-gray-900">Modifier le produit</h1> 
             <p className="text-sm text-gray-400">Mettez à jour les informations</p> 
           </div> 
         </div> 
         <Button variant="ghost" onClick={handleSupprimer} className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"> 
           <Trash2 className="w-4 h-4" /> 
           Supprimer 
         </Button> 
       </div> 
 
       {erreur && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{erreur}</div>} 
 
       <form onSubmit={handleSubmit} className="space-y-5 bg-white border rounded-2xl p-6"> 
 
         {/* Images existantes */} 
         <div> 
           <Label>Photos actuelles</Label> 
           <div className="mt-2 flex flex-wrap gap-3"> 
             {imagesExistantes.map((src, i) => ( 
               <div key={i} className="relative w-20 h-20"> 
                 <Image src={src} alt="" fill className="object-cover rounded-lg border" /> 
                 <button type="button" onClick={() => supprimerImageExistante(i)} 
                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"> 
                   <X className="w-3 h-3" /> 
                 </button> 
               </div> 
             ))} 
             {/* Nouvelles images */} 
             {previews.map((src, i) => ( 
               <div key={`new-${i}`} className="relative w-20 h-20"> 
                 <img src={src} alt="" className="w-full h-full object-cover rounded-lg border border-primary" /> 
                 <button type="button" onClick={() => supprimerNouvelleImage(i)} 
                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"> 
                   <X className="w-3 h-3" /> 
                 </button> 
               </div> 
             ))} 
             {(imagesExistantes.length + nouvellesImages.length) < 4 && ( 
               <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition"> 
                 <Upload className="w-5 h-5 text-gray-400" /> 
                 <span className="text-xs text-gray-400 mt-1">Ajouter</span> 
                 <input type="file" accept="image/*" multiple onChange={handleNouvellesImages} className="hidden" /> 
               </label> 
             )} 
           </div> 
         </div> 
 
         <div> 
           <Label htmlFor="nom">Nom du produit *</Label> 
           <Input id="nom" name="nom" value={form.nom} onChange={handleChange} required className="mt-1" /> 
         </div> 
 
         <div> 
           <Label htmlFor="description">Description</Label> 
           <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} 
             className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" /> 
         </div> 
 
         <div> 
           <Label htmlFor="prix">Prix (FCFA) *</Label> 
           <Input id="prix" name="prix" type="number" value={form.prix} onChange={handleChange} required min="0" className="mt-1" /> 
         </div> 
 
         <div> 
           <Label htmlFor="categorie">Catégorie</Label> 
           <select id="categorie" name="categorie" value={form.categorie} onChange={handleChange} 
             className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"> 
             <option value="">Sélectionner une catégorie</option> 
             {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)} 
           </select> 
         </div> 
 
         {/* Stock */} 
         <div> 
           <Label>Stock disponible</Label> 
           <div className="mt-2 flex items-center gap-3"> 
             <label className="flex items-center gap-2 cursor-pointer"> 
               <input 
                 type="checkbox" 
                 checked={form.stock_illimite} 
                 onChange={(e) => setForm({ ...form, stock_illimite: e.target.checked })} 
                 className="w-4 h-4 accent-primary" 
               /> 
               <span className="text-sm text-gray-600">Stock illimité</span> 
             </label> 
           </div> 
           {!form.stock_illimite && ( 
             <Input 
               type="number" 
               name="stock" 
               placeholder="Ex: 10" 
               value={form.stock} 
               onChange={handleChange} 
               min="0" 
               className="mt-2" 
             /> 
           )} 
         </div> 
 
         <div> 
           <Label htmlFor="statut">Statut</Label> 
           <select id="statut" name="statut" value={form.statut} onChange={handleChange} 
             className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"> 
             <option value="actif">Actif — visible par les acheteurs</option> 
             <option value="inactif">Inactif — masqué</option> 
           </select> 
         </div> 
 
         <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-5" disabled={sauvegarde}> 
           {sauvegarde ? 'Sauvegarde...' : 'Sauvegarder les modifications'} 
         </Button> 
       </form> 
     </div> 
   ) 
 } 
