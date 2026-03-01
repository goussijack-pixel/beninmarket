'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Package, Upload, X, ArrowRight, Sparkles, Infinity } from 'lucide-react'

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
    nom: '', description: '', prix: '', categorie: '',
    stock: '0', stock_illimite: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 4) { setErreur('Maximum 4 images'); return }
    setImages([...images, ...files])
    setPreviews([...previews, ...files.map(f => URL.createObjectURL(f))])
  }

  const supprimerImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
  }

  const genererSlug = (nom: string) => {
    return nom.toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now()
  }

  const uploadImages = async (boutiqueId: string): Promise<string[]> => {
    const urls: string[] = []
    for (const image of images) {
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
    setChargement(true)
    setErreur('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/connexion'); return }

    const { data: boutique } = await supabase
      .from('boutiques').select('id').eq('vendeur_id', user.id).single()

    if (!boutique) { setErreur('Créez d\'abord votre boutique'); setChargement(false); return }

    const imageUrls = await uploadImages(boutique.id)

    const { error } = await supabase.from('produits').insert({
      boutique_id: boutique.id,
      nom: form.nom, slug: genererSlug(form.nom),
      description: form.description, prix: parseInt(form.prix),
      categorie: form.categorie, images: imageUrls,
      stock: form.stock_illimite ? null : parseInt(form.stock),
      stock_illimite: form.stock_illimite, statut: 'actif',
    })

    if (error) { setErreur('Erreur lors de la création du produit'); setChargement(false); return }
    router.push('/vendeur/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-orange-500/8 blur-[100px]" />
      </div>

      <div className="relative max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-amber-400/20 rounded-xl flex items-center justify-center">
            <Package className="text-amber-400 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Ajouter un produit</h1>
            <p className="text-sm text-white/30">Remplissez les informations du produit</p>
          </div>
        </div>

        {erreur && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3.5 rounded-xl mb-5">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/3 border border-white/8 rounded-3xl p-7 space-y-6 backdrop-blur-sm">

          {/* Images */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 block">
              Photos du produit (max 4)
            </label>
            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={src} alt="" className="w-full h-full object-cover rounded-xl border border-amber-400/40" />
                  <button type="button" onClick={() => supprimerImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <label className="w-20 h-20 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-400/40 transition-colors">
                  <Upload className="w-5 h-5 text-white/20" />
                  <span className="text-xs text-white/20 mt-1">Ajouter</span>
                  <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="h-[1px] bg-white/5" />

          {/* Nom */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Nom du produit *</label>
            <input name="nom" placeholder="Ex: Robe en tissu wax" value={form.nom}
              onChange={handleChange} required
              className="w-full px-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 transition-all" />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Description</label>
            <textarea name="description" placeholder="Décrivez votre produit (taille, couleur, matière...)"
              value={form.description} onChange={handleChange} rows={3}
              className="w-full px-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 transition-all resize-none" />
          </div>

          {/* Prix */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Prix (FCFA) *</label>
            <input name="prix" type="number" placeholder="Ex: 5000" value={form.prix}
              onChange={handleChange} required min="0"
              className="w-full px-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 transition-all" />
          </div>

          {/* Catégorie */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Catégorie</label>
            <select name="categorie" value={form.categorie} onChange={handleChange}
              className="w-full px-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400/40 transition-all">
              <option value="" className="bg-[#1a1a1a]">Sélectionner une catégorie</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>)}
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 block">Stock disponible</label>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <div className={`w-10 h-6 rounded-full border transition-all flex items-center px-0.5 ${
                form.stock_illimite ? 'bg-amber-400 border-amber-400' : 'bg-white/5 border-white/15'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  form.stock_illimite ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
              <div className="flex items-center gap-2">
                <Infinity className={`w-4 h-4 ${form.stock_illimite ? 'text-amber-400' : 'text-white/25'}`} />
                <span className={`text-sm font-medium ${form.stock_illimite ? 'text-amber-300' : 'text-white/40'}`}>
                  Stock illimité
                </span>
              </div>
              <input type="checkbox" checked={form.stock_illimite}
                onChange={(e) => setForm({ ...form, stock_illimite: e.target.checked })} className="hidden" />
            </label>
            {!form.stock_illimite && (
              <input type="number" name="stock" placeholder="Ex: 10" value={form.stock}
                onChange={handleChange} min="0"
                className="w-full px-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 transition-all" />
            )}
          </div>

          <div className="h-[1px] bg-white/5" />

          {/* Bouton */}
          <button type="submit" disabled={chargement}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            {chargement ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Publier le produit
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}