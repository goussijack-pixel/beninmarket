'use client' 
 
 import { useState } from 'react' 
 import { useRouter } from 'next/navigation' 
 import { supabase } from '@/lib/supabase/client' 
 import { Button } from '@/components/ui/button' 
 import { Input } from '@/components/ui/input' 
 import { Label } from '@/components/ui/label' 
 import { Package, Upload, X } from 'lucide-react' 
 
 const CATEGORIES = [ 
   'Mode & Vêtements', 'Électronique', 'Alimentation', 
   'Maison & Déco', 'Beauté & Santé', 'Agriculture', 
   'Artisanat', 'Services', 'Autre' 
 ] 
 
 export default function NouveauProduitPage() { 
   const router = useRouter() 
   const [chargement, setChargement] = useState(false) 
   const [erreur, setErreur] = useState('') 
   const [images, setImages] = useState<File[]>([]) 
   const [previews, setPreviews] = useState<string[]>([]) 
   const [form, setForm] = useState({ 
     nom: '', 
     description: '', 
     prix: '', 
     categorie: '', 
     stock: '0', 
     stock_illimite: false, 
   }) 
 
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { 
     setForm({ ...form, [e.target.name]: e.target.value }) 
   } 
 
   const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => { 
     const files = Array.from(e.target.files || []) 
     if (files.length + images.length > 4) { 
       setErreur('Maximum 4 images') 
       return 
     } 
     setImages([...images, ...files]) 
     const newPreviews = files.map(f => URL.createObjectURL(f)) 
     setPreviews([...previews, ...newPreviews]) 
   } 
 
   const supprimerImage = (index: number) => { 
     setImages(images.filter((_, i) => i !== index)) 
     setPreviews(previews.filter((_, i) => i !== index)) 
   } 
 
   const genererSlug = (nom: string) => { 
     return nom 
       .toLowerCase() 
       .normalize('NFD') 
       .replace(/[\u0300-\u036f]/g, '') 
       .replace(/[^a-z0-9]+/g, '-') 
       .replace(/(^-|-$)/g, '') + '-' + Date.now() 
   } 
 
   const uploadImages = async (boutiqueId: string): Promise<string[]> => { 
     const urls: string[] = [] 
     for (const image of images) { 
       const nomFichier = `${boutiqueId}/${Date.now()}-${image.name}` 
       const { data, error } = await supabase.storage 
         .from('produits') 
         .upload(nomFichier, image) 
       if (!error && data) { 
         const { data: urlData } = supabase.storage 
           .from('produits') 
           .getPublicUrl(data.path) 
         urls.push(urlData.publicUrl) 
       } 
     } 
     return urls 
   } 
 
   const handleSubmit = async (e: React.FormEvent) => { 
     e.preventDefault() 
     setChargement(true) 
     setErreur('') 
 
     const { data: { user } } = await supabase.auth.getUser() 
     if (!user) { router.push('/connexion'); return } 
 
     // Récupérer la boutique du vendeur 
     const { data: boutique } = await supabase 
       .from('boutiques') 
       .select('id') 
       .eq('vendeur_id', user.id) 
       .single() 
 
     if (!boutique) { 
       setErreur('Créez d\'abord votre boutique') 
       setChargement(false) 
       return 
     } 
 
     // Upload images 
     const imageUrls = await uploadImages(boutique.id) 
 
     // Créer le produit 
     const { error } = await supabase.from('produits').insert({ 
         boutique_id: boutique.id, 
         nom: form.nom, 
         slug: genererSlug(form.nom), 
         description: form.description, 
         prix: parseInt(form.prix), 
         categorie: form.categorie, 
         images: imageUrls, 
         stock: form.stock_illimite ? null : parseInt(form.stock), 
         stock_illimite: form.stock_illimite, 
         statut: 'actif', 
       }) 
 
     if (error) { 
       setErreur('Erreur lors de la création du produit') 
       setChargement(false) 
       return 
     } 
 
     router.push('/vendeur/dashboard') 
   } 
 
   return ( 
     <div className="max-w-xl mx-auto px-4 py-10"> 
       <div className="flex items-center gap-3 mb-8"> 
         <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"> 
           <Package className="text-primary w-5 h-5" /> 
         </div> 
         <div> 
           <h1 className="text-xl font-bold text-gray-900">Ajouter un produit</h1> 
           <p className="text-sm text-gray-400">Remplissez les informations du produit</p> 
         </div> 
       </div> 
 
       {erreur && ( 
         <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{erreur}</div> 
       )} 
 
       <form onSubmit={handleSubmit} className="space-y-5 bg-white border rounded-2xl p-6"> 
 
         {/* Images */} 
         <div> 
           <Label>Photos du produit (max 4)</Label> 
           <div className="mt-2 flex flex-wrap gap-3"> 
             {previews.map((src, i) => ( 
               <div key={i} className="relative w-20 h-20"> 
                 <img src={src} alt="" className="w-full h-full object-cover rounded-lg border" /> 
                 <button 
                   type="button" 
                   onClick={() => supprimerImage(i)} 
                   className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center" 
                 > 
                   <X className="w-3 h-3" /> 
                 </button> 
               </div> 
             ))} 
             {images.length < 4 && ( 
               <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition"> 
                 <Upload className="w-5 h-5 text-gray-400" /> 
                 <span className="text-xs text-gray-400 mt-1">Ajouter</span> 
                 <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" /> 
               </label> 
             )} 
           </div> 
         </div> 
 
         <div> 
           <Label htmlFor="nom">Nom du produit *</Label> 
           <Input 
             id="nom" 
             name="nom" 
             placeholder="Ex: Robe en tissu wax" 
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
             placeholder="Décrivez votre produit (taille, couleur, matière...)" 
             value={form.description} 
             onChange={handleChange} 
             rows={3} 
             className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" 
           /> 
         </div> 
 
         <div> 
           <Label htmlFor="prix">Prix (FCFA) *</Label> 
           <Input 
             id="prix" 
             name="prix" 
             type="number" 
             placeholder="Ex: 5000" 
             value={form.prix} 
             onChange={handleChange} 
             required 
             min="0" 
             className="mt-1" 
           /> 
         </div> 
 
         <div> 
           <Label htmlFor="categorie">Catégorie</Label> 
           <select 
             id="categorie" 
             name="categorie" 
             value={form.categorie} 
             onChange={handleChange} 
             className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
           > 
             <option value="">Sélectionner une catégorie</option> 
             {CATEGORIES.map(cat => ( 
               <option key={cat} value={cat}>{cat}</option> 
             ))} 
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
 
         <Button 
           type="submit" 
           className="w-full bg-primary hover:bg-primary/90 text-white py-5" 
           disabled={chargement} 
         > 
           {chargement ? 'Publication en cours...' : 'Publier le produit'} 
         </Button> 
       </form> 
     </div> 
   ) 
 } 
