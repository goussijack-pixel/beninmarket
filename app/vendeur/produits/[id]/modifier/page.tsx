'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Package, Upload, X, Trash2, ArrowRight, Sparkles, Infinity } from 'lucide-react'
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
    nom: '', description: '', prix: '', categorie: '',
    statut: 'actif', stock: '0', stock_illimite: false,
  })

  useEffect(() => {
    const chargerProduit = async () => {
      const { data: produit } = await supabase
        .from('produits').select('*').eq('id', produitId).single()
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
      .from('boutiques').select('id').eq('vendeur_id', user.id).single()

    if (!boutique) { setErreur('Boutique introuvable'); setSauvegarde(false); return }

    const nouvellesUrls = await uploadImages(boutique.id)
    const toutesImages = [...imagesExistantes, ...nouvellesUrls]

    const { error } = await supabase.from('produits').update({
      nom: form.nom, description: form.description,
      prix: parseInt(form.prix), categorie: form.categorie,
      statut: form.statut, images: toutesImages,
      stock: form.stock_illimite ? null : parseInt(form.stock),
      stock_illimite: form.stock_illimite,
    }).eq('id', produitId)

    if (error) { setErreur('Erreur lors de la sauvegarde'); setSauvegarde(false); return }
    router.push('/vendeur/dashboard')
  }

  const handleSupprimer = async () => {
    if (!confirm('Supprimer ce produit définitivement ?')) return
    await supabase.from('produits').delete().eq('id', produitId)
    router.push('/vendeur/dashboard')
  }

  if (chargement) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] rounded-full bg-orange-500/8 blur-[100px]" />
      </div>

      <div className="relative max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-amber-400/20 rounded-xl flex items-center justify-center">
              <Package className="text-amber-400 w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Modifier le produit</h1>
              <p className="text-sm text-white/30">Mettez à jour les informations</p>
            </div>
          </div>
          <button
            onClick={handleSupprimer}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 text-sm font-medium transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Supprimer
          </button>
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
              {imagesExistantes.map((src, i) => (
                <div key={i} className="relative w-20 h-20">
                  <Image src={src} alt="" fill className="object-cover rounded-xl border border-white/10" />
                  <button type="button" onClick={() => supprimerImageExistante(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {previews.map((src, i) => (
                <div key={`new-${i}`} className="relative w-20 h-20">
                  <img src={src} alt="" className="w-full h-full object-cover rounded-xl border border-amber-400/40" />
                  <button type="button" onClick={() => supprimerNouvelleImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {(imagesExistantes.length + nouvellesImages.length) < 4 && (
                <label className="w-20 h-20 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-400/40 transition-colors">
                  <Upload className="w-5 h-5 text-white/20" />
                  <span className="text-xs text-white/20 mt-1">Ajouter</span>
                  <input type="file" accept="image/*" multiple onChange={handleNouvellesImages} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="h-[1px] bg-white/5" />

          {/* Nom */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Nom du produit *</label>
            <input name="nom" value={form.nom} onChange={handleChange} required
              className="w-full px-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 transition-all" />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full px-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 transition-all resize-none" />
          </div>

          {/* Prix */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Prix (FCFA) *</label>
            <input name="prix" type="number" value={form.prix} onChange={handleChange} required min="0"
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
            <label className="flex items-center gap-3 cursor-pointer mb-3 group">
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

          {/* Statut */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">Statut</label>
            <select name="statut" value={form.statut} onChange={handleChange}
              className="w-full px-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400/40 transition-all">
              <option value="actif" className="bg-[#1a1a1a]">✅ Actif — visible par les acheteurs</option>
              <option value="inactif" className="bg-[#1a1a1a]">🔒 Inactif — masqué</option>
            </select>
          </div>

          <div className="h-[1px] bg-white/5" />

          {/* Bouton */}
          <button type="submit" disabled={sauvegarde}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            {sauvegarde ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Sauvegarder les modifications
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}