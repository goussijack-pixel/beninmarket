'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Store, MapPin, Phone, MessageCircle, ArrowRight, Sparkles } from 'lucide-react'

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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Effets lumineux */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-orange-500/8 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-lg">

        {/* En-tête */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/30">
            <Store className="w-8 h-8 text-black" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-300 text-xs font-medium mb-3">
            <Sparkles className="w-3 h-3" />
            Espace Vendeur
          </div>
          <h1 className="text-2xl font-black text-white">Créer ma boutique</h1>
          <p className="text-white/30 text-sm mt-1">Remplissez les informations de votre boutique</p>
        </div>

        {/* Erreur */}
        {erreur && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3.5 rounded-xl mb-5">
            {erreur}
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-white/3 border border-white/8 rounded-3xl p-8 backdrop-blur-sm shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nom */}
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">
                Nom de la boutique *
              </label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input
                  name="nom"
                  placeholder="Ex: Boutique Mode Cotonou"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Décrivez vos produits et services..."
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 focus:bg-white/8 transition-all resize-none"
              />
            </div>

            {/* Ville + Quartier */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">
                  Ville *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                  <input
                    name="ville"
                    placeholder="Cotonou"
                    value={form.ville}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 focus:bg-white/8 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">
                  Quartier
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                  <input
                    name="quartier"
                    placeholder="Akpakpa"
                    value={form.quartier}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 focus:bg-white/8 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input
                  name="telephone"
                  placeholder="+229 97 00 00 00"
                  value={form.telephone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            {/* WhatsApp */}
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">
                WhatsApp * <span className="normal-case font-normal text-white/25">(pour recevoir les commandes)</span>
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input
                  name="whatsapp"
                  placeholder="+22997000000"
                  value={form.whatsapp}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 focus:bg-white/8 transition-all"
                />
              </div>
              <p className="text-xs text-white/20 mt-1.5 pl-1">Format international : +229XXXXXXXX</p>
            </div>

            {/* Séparateur */}
            <div className="h-[1px] bg-white/5" />

            {/* Bouton */}
            <button
              type="submit"
              disabled={chargement}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {chargement ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Créer ma boutique
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}