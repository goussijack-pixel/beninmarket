'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function BoutonCopierLien({ slug }: { slug: string }) {
  const [copie, setCopie] = useState(false)

  const copierLien = async () => {
    const lien = `${window.location.origin}/boutiques/${slug}`
    await navigator.clipboard.writeText(lien)
    setCopie(true)
    setTimeout(() => setCopie(false), 2000)
  }

  return (
    <button
      onClick={copierLien}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-300 ${
        copie
          ? 'bg-green-500/15 border-green-500/30 text-green-400 scale-95'
          : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-amber-400/30 hover:bg-white/8'
      }`}
    >
      {copie ? (
        <>
          <Check className="w-4 h-4" />
          Lien copié !
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copier le lien
        </>
      )}
    </button>
  )
}