'use client'

import React, { useState } from 'react'
import { usePanier } from './PanierContext'
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function PanierFlottant() {
  const { items, ajouterProduit, retirerProduit, supprimerProduit, totalPrix, nombreArticles } = usePanier()
  const [isOpen, setIsOpen] = useState(false)

  if (nombreArticles === 0 && !isOpen) return null

  const itemsParBoutique = items.reduce((acc, item) => {
    const boutiqueNom = item.boutique?.nom || 'Boutique Inconnue'
    if (!acc[boutiqueNom]) acc[boutiqueNom] = []
    acc[boutiqueNom].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  const envoyerCommandeWhatsApp = async (boutiqueNom: string, itemsBoutique: typeof items) => {
    const boutique = itemsBoutique[0]?.boutique
    if (!boutique?.whatsapp) return

    try {
      const updates = itemsBoutique
        .filter(item => !item.stock_illimite && item.stock !== null)
        .map(async (item) => {
          const nouveauStock = Math.max(0, (item.stock || 0) - item.quantite)
          return supabase.from('produits').update({ stock: nouveauStock }).eq('id', item.id)
        })
      if (updates.length > 0) await Promise.all(updates)
    } catch (error) {
      console.error('Erreur décrémentation stock:', error)
      toast.error('Un problème est survenu lors de la mise à jour du stock')
    }

    let message = `Bonjour ! Je souhaite commander les produits suivants de votre boutique "${boutiqueNom}" sur BéninMarket :\n\n`
    itemsBoutique.forEach((item) => {
      message += `- ${item.nom} (x${item.quantite}) : ${(item.prix * item.quantite).toLocaleString('fr-FR')} FCFA\n`
    })
    const totalBoutique = itemsBoutique.reduce((sum, item) => sum + item.prix * item.quantite, 0)
    message += `\nTotal : ${totalBoutique.toLocaleString('fr-FR')} FCFA\n\nMerci de me confirmer la disponibilité !`

    window.open(`https://wa.me/${boutique.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <>
      {/* ─── Bouton flottant ─── */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 text-black rounded-full shadow-2xl shadow-amber-500/40 hover:scale-110 transition-all flex items-center justify-center animate-glow"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0a0a] shadow-lg">
          {nombreArticles}
        </span>
      </button>

      {/* ─── Panel ─── */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panier panel */}
          <div className="relative w-full max-w-md bg-[#0f0f0f] border-l border-white/8 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

            {/* Ligne dorée top */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

            {/* Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <ShoppingCart className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h2 className="font-black text-white">Mon Panier</h2>
                  <p className="text-xs text-white/30">{nombreArticles} article{nombreArticles > 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {Object.entries(itemsParBoutique).map(([boutiqueNom, itemsBoutique]) => (
                <div key={boutiqueNom} className="space-y-3">

                  {/* Nom boutique */}
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <h3 className="text-xs font-bold text-amber-400/70 uppercase tracking-widest">
                      {boutiqueNom}
                    </h3>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {itemsBoutique.map((item) => (
                      <div key={item.id} className="flex gap-3 bg-white/3 border border-white/5 p-3 rounded-2xl hover:border-amber-400/15 transition-all">
                        {/* Image */}
                        <div className="w-14 h-14 relative rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/8">
                          {item.images?.[0] ? (
                            <Image src={item.images[0]} alt={item.nom} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                          )}
                        </div>

                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white/80 truncate">{item.nom}</p>
                          <p className="text-sm font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                            {item.prix.toLocaleString('fr-FR')} FCFA
                          </p>

                          {/* Contrôles quantité */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-lg px-1">
                              <button onClick={() => retirerProduit(item.id)}
                                className="p-1.5 hover:text-amber-400 transition text-white/40">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-black text-white min-w-[20px] text-center">
                                {item.quantite}
                              </span>
                              <button onClick={() => ajouterProduit(item)}
                                className="p-1.5 hover:text-amber-400 transition text-white/40">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button onClick={() => supprimerProduit(item.id)}
                              className="text-white/20 hover:text-red-400 transition p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bouton commande WhatsApp */}
                  <button
                    onClick={() => envoyerCommandeWhatsApp(boutiqueNom, itemsBoutique)}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-green-500/15 border border-green-500/25 text-green-400 hover:bg-green-500/20 font-bold text-sm rounded-xl transition-all hover:scale-[1.02]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Commander chez {boutiqueNom}
                  </button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-sm">Total général</span>
                <span className="text-xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                  {totalPrix.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-400/5 border border-amber-400/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-400/60 flex-shrink-0" />
                <p className="text-[11px] text-white/25">
                  Commande boutique par boutique via WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}