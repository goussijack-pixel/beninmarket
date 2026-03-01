'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X, Search, Store, Package, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/produits?q=${encodeURIComponent(searchValue.trim())}`)
      setMenuOuvert(false)
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/8 shadow-2xl shadow-black/50'
          : 'bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5'
      }`}
    >
      {/* Ligne dorée top */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-4 h-4 text-black" />
          </div>
          <span className="font-black text-lg bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent tracking-tight">
            BéninMarket
          </span>
        </Link>

        {/* Barre de recherche - desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 w-4 h-4" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-amber-400/40 focus:bg-white/8 transition-all"
            />
          </div>
        </form>

        {/* Nav - desktop */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/produits"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <Package className="w-4 h-4" />
            Produits
          </Link>
          <Link
            href="/boutiques"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <Store className="w-4 h-4" />
            Boutiques
          </Link>
        </nav>

        {/* Actions - desktop */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <Link
            href="/connexion"
            className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 text-black text-sm font-bold rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all hover:scale-105 shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Vendre
          </Link>
        </div>

        {/* Burger - mobile */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 text-white hover:bg-white/10 transition-all"
          onClick={() => setMenuOuvert(!menuOuvert)}
        >
          {menuOuvert ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOuvert && (
        <div className="md:hidden bg-[#0f0f0f] border-t border-white/5 px-4 py-5 flex flex-col gap-3">

          {/* Recherche mobile */}
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 w-4 h-4" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-amber-400/40 transition-all"
            />
          </form>

          {/* Liens */}
          <Link
            href="/produits"
            onClick={() => setMenuOuvert(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 font-medium transition-all"
          >
            <Package className="w-4 h-4" />
            Produits
          </Link>
          <Link
            href="/boutiques"
            onClick={() => setMenuOuvert(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 font-medium transition-all"
          >
            <Store className="w-4 h-4" />
            Boutiques
          </Link>

          <div className="h-[1px] bg-white/5 my-1" />

          <Link
            href="/connexion"
            onClick={() => setMenuOuvert(false)}
            className="px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 font-medium text-center transition-all"
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            onClick={() => setMenuOuvert(false)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Devenir vendeur
          </Link>
        </div>
      )}
    </header>
  )
}