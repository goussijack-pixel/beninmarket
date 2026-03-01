'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function GalerieImages({ images, nom }: { images: string[], nom: string }) {
  const [imageActive, setImageActive] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => {
      setImageActive(prev => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [images.length])

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-white/5 border border-white/8 rounded-2xl flex items-center justify-center text-7xl">
        🛍️
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Image principale */}
      <div className="aspect-square bg-white/5 rounded-2xl overflow-hidden relative group border border-white/8">
        <Image
          src={images[imageActive]}
          alt={`${nom} - image ${imageActive + 1}`}
          fill
          className="object-cover transition-all duration-500"
        />

        {/* Overlay gradient bas */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Flèches navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setImageActive(prev => (prev - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 backdrop-blur-sm border border-white/15 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setImageActive(prev => (prev + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 backdrop-blur-sm border border-white/15 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-amber-400 hover:text-black hover:border-amber-400 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicateurs */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImageActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === imageActive
                    ? 'bg-amber-400 w-5 h-2'
                    : 'bg-white/30 w-2 h-2 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Compteur */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full text-xs text-white/70 font-medium">
            {imageActive + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Miniatures */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setImageActive(i)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                imageActive === i
                  ? 'border-amber-400 shadow-lg shadow-amber-400/20 scale-105'
                  : 'border-white/8 hover:border-white/20 opacity-50 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`${nom} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}