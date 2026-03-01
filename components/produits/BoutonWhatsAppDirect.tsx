'use client'

import React, { useState } from 'react'
import { MessageCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { Produit } from '@/types'
import { toast } from 'sonner'

interface BoutonWhatsAppDirectProps {
  produit: Produit
  lienWhatsApp: string
}

export default function BoutonWhatsAppDirect({ produit, lienWhatsApp }: BoutonWhatsAppDirectProps) {
  const [chargement, setChargement] = useState(false)

  const enRupture = !produit.stock_illimite && produit.stock === 0

  const handleCommande = async () => {
    if (enRupture) return
    setChargement(true)

    if (!produit.stock_illimite && produit.stock !== null && produit.stock > 0) {
      try {
        const { error } = await supabase
          .from('produits')
          .update({ stock: Math.max(0, (produit.stock || 0) - 1) })
          .eq('id', produit.id)
        if (error) throw error
      } catch (error) {
        console.error('Erreur stock:', error)
        toast.error('Erreur lors de la mise à jour du stock')
      }
    }

    window.open(lienWhatsApp, '_blank')
    setChargement(false)
  }

  return (
    <button
      onClick={handleCommande}
      disabled={chargement || enRupture}
      className={`w-full flex items-center justify-center gap-3 py-4 text-base font-bold rounded-xl transition-all duration-300 ${
        enRupture
          ? 'bg-red-500/10 border border-red-500/20 text-red-400/50 cursor-not-allowed'
          : chargement
          ? 'bg-green-500/10 border border-green-500/20 text-green-400/50 cursor-wait'
          : 'bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25 hover:scale-[1.02] shadow-lg shadow-green-500/10'
      }`}
    >
      {chargement ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <MessageCircle className="w-5 h-5" />
      )}
      {enRupture ? 'Rupture de stock' : chargement ? 'Redirection...' : 'Commander via WhatsApp'}
    </button>
  )
}