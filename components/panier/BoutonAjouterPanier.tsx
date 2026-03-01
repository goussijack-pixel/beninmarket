'use client'

import React, { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { usePanier } from './PanierContext'
import { Produit } from '@/types'

interface BoutonAjouterPanierProps {
  produit: Produit
  fullWidth?: boolean
}

export default function BoutonAjouterPanier({
  produit,
  fullWidth = false,
}: BoutonAjouterPanierProps) {
  const { ajouterProduit } = usePanier()
  const [ajoute, setAjoute] = useState(false)

  const handleAjouter = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    ajouterProduit(produit)
    setAjoute(true)
    setTimeout(() => setAjoute(false), 2000)
  }

  return (
    <button
      onClick={handleAjouter}
      className={`flex items-center justify-center gap-2 font-bold text-sm rounded-xl transition-all duration-300 ${
        fullWidth ? 'w-full py-3' : 'px-4 py-2.5'
      } ${
        ajoute
          ? 'bg-green-500/15 border border-green-500/30 text-green-400 scale-95'
          : 'bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:from-amber-500 hover:to-orange-600 hover:scale-[1.03] shadow-lg shadow-amber-500/20'
      }`}
    >
      {ajoute ? (
        <>
          <Check className="w-4 h-4" />
          Ajouté !
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          Ajouter au panier
        </>
      )}
    </button>
  )
}