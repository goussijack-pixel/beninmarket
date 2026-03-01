'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Produit } from '@/types'

export interface PanierItem extends Produit {
  quantite: number
}

interface PanierContextType {
  items: PanierItem[]
  ajouterProduit: (produit: Produit) => void
  retirerProduit: (produitId: string) => void
  supprimerProduit: (produitId: string) => void
  viderPanier: () => void
  totalPrix: number
  nombreArticles: number
}

const PanierContext = createContext<PanierContextType | undefined>(undefined)

export function PanierProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<PanierItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Charger le panier depuis le localStorage au démarrage
  useEffect(() => {
    const savedPanier = localStorage.getItem('beninmarket_panier')
    if (savedPanier) {
      try {
        setItems(JSON.parse(savedPanier))
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('beninmarket_panier', JSON.stringify(items))
    }
  }, [items, isInitialized])

  const ajouterProduit = (produit: Produit) => {
    setItems((prevItems) => {
      const itemExistant = prevItems.find((item) => item.id === produit.id)
      if (itemExistant) {
        return prevItems.map((item) =>
          item.id === produit.id
            ? { ...item, quantite: item.quantite + 1 }
            : item
        )
      }
      return [...prevItems, { ...produit, quantite: 1 }]
    })
  }

  const retirerProduit = (produitId: string) => {
    setItems((prevItems) => {
      const itemExistant = prevItems.find((item) => item.id === produitId)
      if (itemExistant && itemExistant.quantite > 1) {
        return prevItems.map((item) =>
          item.id === produitId
            ? { ...item, quantite: item.quantite - 1 }
            : item
        )
      }
      return prevItems.filter((item) => item.id !== produitId)
    })
  }

  const supprimerProduit = (produitId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== produitId))
  }

  const viderPanier = () => {
    setItems([])
  }

  const totalPrix = items.reduce(
    (total, item) => total + item.prix * item.quantite,
    0
  )

  const nombreArticles = items.reduce((total, item) => total + item.quantite, 0)

  return (
    <PanierContext.Provider
      value={{
        items,
        ajouterProduit,
        retirerProduit,
        supprimerProduit,
        viderPanier,
        totalPrix,
        nombreArticles,
      }}
    >
      {children}
    </PanierContext.Provider>
  )
}

export function usePanier() {
  const context = useContext(PanierContext)
  if (context === undefined) {
    throw new Error('usePanier doit être utilisé à l\'intérieur d\'un PanierProvider')
  }
  return context
}
