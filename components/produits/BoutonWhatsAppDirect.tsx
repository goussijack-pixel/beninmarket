'use client'

import React, { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { Produit } from '@/types'
import { toast } from 'sonner'

interface BoutonWhatsAppDirectProps {
  produit: Produit
  lienWhatsApp: string
}

export default function BoutonWhatsAppDirect({ produit, lienWhatsApp }: BoutonWhatsAppDirectProps) {
  const [chargement, setChargement] = useState(false)

  const handleCommande = async () => {
    setChargement(true)
    
    // 1. Décrémenter le stock si nécessaire
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

    // 2. Rediriger vers WhatsApp
    window.open(lienWhatsApp, '_blank')
    setChargement(false)
  }

  return (
    <Button 
      onClick={handleCommande}
      disabled={chargement || (!produit.stock_illimite && produit.stock === 0)}
      variant="outline" 
      className="w-full border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 py-6 text-lg gap-3 rounded-xl"
    >
      <MessageCircle className="w-6 h-6" />
      {produit.stock === 0 && !produit.stock_illimite ? 'Rupture de stock' : 'Commander via WhatsApp'}
    </Button>
  )
}
