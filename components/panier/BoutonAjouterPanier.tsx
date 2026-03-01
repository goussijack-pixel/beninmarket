'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
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
    <Button
      onClick={handleAjouter}
      variant={ajoute ? 'secondary' : 'default'}
      className={`gap-2 rounded-xl transition-all duration-300 ${
        fullWidth ? 'w-full py-6' : ''
      }`}
    >
      {ajoute ? (
        <>
          <Check className="w-5 h-5 text-green-500" />
          Ajouté !
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Ajouter au panier
        </>
      )}
    </Button>
  )
}
