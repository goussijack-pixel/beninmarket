'use client'

import React, { useState } from 'react'
import { usePanier } from './PanierContext'
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function PanierFlottant() {
  const { items, ajouterProduit, retirerProduit, supprimerProduit, totalPrix, nombreArticles } = usePanier()
  const [isOpen, setIsOpen] = useState(false)

  if (nombreArticles === 0 && !isOpen) return null

  // Group items by boutique
  const itemsParBoutique = items.reduce((acc, item) => {
    const boutiqueNom = item.boutique?.nom || 'Boutique Inconnue'
    if (!acc[boutiqueNom]) acc[boutiqueNom] = []
    acc[boutiqueNom].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  const envoyerCommandeWhatsApp = async (boutiqueNom: string, itemsBoutique: typeof items) => {
    const boutique = itemsBoutique[0]?.boutique
    if (!boutique?.whatsapp) return

    // 1. Décrémenter le stock dans Supabase pour chaque article (si stock fini)
    try {
      const updates = itemsBoutique
        .filter(item => !item.stock_illimite && item.stock !== null)
        .map(async (item) => {
          const nouveauStock = Math.max(0, (item.stock || 0) - item.quantite)
          return supabase
            .from('produits')
            .update({ stock: nouveauStock })
            .eq('id', item.id)
        })

      if (updates.length > 0) {
        await Promise.all(updates)
      }
    } catch (error) {
      console.error('Erreur décrémentation stock:', error)
      toast.error('Un problème est survenu lors de la mise à jour du stock')
    }

    // 2. Préparer et envoyer le message WhatsApp
    let message = `Bonjour ! Je souhaite commander les produits suivants de votre boutique "${boutiqueNom}" sur BéninMarket :\n\n`
    
    itemsBoutique.forEach((item) => {
      message += `- ${item.nom} (x${item.quantite}) : ${(item.prix * item.quantite).toLocaleString('fr-FR')} FCFA\n`
    })

    const totalBoutique = itemsBoutique.reduce((sum, item) => sum + item.prix * item.quantite, 0)
    message += `\nTotal : ${totalBoutique.toLocaleString('fr-FR')} FCFA\n`
    message += `\nMerci de me confirmer la disponibilité !`

    const lienWhatsApp = `https://wa.me/${boutique.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(lienWhatsApp, '_blank')
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 transition group"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
          {nombreArticles}
        </span>
      </button>

      {/* Overlay & Side Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panier panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-lg text-gray-900">Mon Panier</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {Object.entries(itemsParBoutique).map(([boutiqueNom, itemsBoutique]) => (
                <div key={boutiqueNom} className="space-y-3">
                  <h3 className="font-semibold text-sm text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full" />
                    {boutiqueNom}
                  </h3>
                  
                  <div className="space-y-4">
                    {itemsBoutique.map((item) => (
                      <div key={item.id} className="flex gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        {/* Image */}
                        <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0 bg-white border">
                          {item.images?.[0] ? (
                            <Image 
                              src={item.images[0]} 
                              alt={item.nom} 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                          )}
                        </div>
                        
                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.nom}</p>
                          <p className="text-primary font-bold text-sm">
                            {item.prix.toLocaleString('fr-FR')} FCFA
                          </p>
                          
                          {/* Controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 bg-white border rounded-lg px-1">
                              <button 
                                onClick={() => retirerProduit(item.id)}
                                className="p-1 hover:text-primary transition"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold min-w-[20px] text-center">
                                {item.quantite}
                              </span>
                              <button 
                                onClick={() => ajouterProduit(item)}
                                className="p-1 hover:text-primary transition"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button 
                              onClick={() => supprimerProduit(item.id)}
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bouton commande par boutique */}
                  <Button 
                    onClick={() => envoyerCommandeWhatsApp(boutiqueNom, itemsBoutique)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-xs h-9 gap-2 rounded-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Commander chez {boutiqueNom}
                  </Button>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total général</span>
                <span className="text-xl font-bold text-primary">
                  {totalPrix.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
              <p className="text-[10px] text-gray-400 text-center italic">
                Note : Vous passerez commande directement via WhatsApp boutique par boutique.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
