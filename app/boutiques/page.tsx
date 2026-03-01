import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Store, Search, Sparkles, ArrowRight } from 'lucide-react'

export default async function ListeBoutiquesPage({
  searchParams,
}: {
  searchParams: { q?: string; ville?: string }
}) {
  const supabase = await createClient()

  let query = supabase
    .from('boutiques')
    .select('*, produits(count)')
    .eq('statut', 'actif')
    .order('created_at', { ascending: false })

  if (searchParams.q) query = query.ilike('nom', `%${searchParams.q}%`)
  if (searchParams.ville) query = query.ilike('ville', `%${searchParams.ville}%`)

  const { data: boutiques } = await query

  const villes = ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon']

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ─── HEADER ─── */}
      <div className="relative border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-50%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-[100px]" />
          <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] rounded-full bg-orange-500/8 blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-10">
          {/* Titre */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-300 text-xs font-medium mb-4">
              <Sparkles className="w-3 h-3" />
              Marketplace BéninMarket
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white">Toutes les boutiques</h1>
            <p className="text-white/30 text-sm mt-2">
              {boutiques?.length || 0} boutique{(boutiques?.length || 0) > 1 ? 's' : ''} de commerçants béninois
            </p>
          </div>

          {/* Recherche */}
          <form method="GET" action="/boutiques" className="flex gap-3 max-w-xl mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 w-4 h-4" />
              <input
                type="text"
                name="q"
                placeholder="Rechercher une boutique..."
                defaultValue={searchParams.q}
                className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/8 rounded-2xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-amber-400/40 focus:bg-white/8 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-2xl text-sm hover:from-amber-500 hover:to-orange-600 transition-all hover:scale-105 shadow-lg shadow-amber-500/20"
            >
              Chercher
            </button>
          </form>

          {/* Filtres villes */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <Link
              href="/boutiques"
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border transition-all flex-shrink-0 ${
                !searchParams.ville
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black border-transparent shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-white/40 border-white/8 hover:border-amber-400/30 hover:text-white'
              }`}
            >
              🌍 Toutes les villes
            </Link>
            {villes.map((ville) => (
              <Link
                key={ville}
                href={`/boutiques?ville=${ville}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border transition-all flex-shrink-0 ${
                  searchParams.ville === ville
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black border-transparent shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-white/40 border-white/8 hover:border-amber-400/30 hover:text-white'
                }`}
              >
                📍 {ville}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── GRILLE BOUTIQUES ─── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {!boutiques || boutiques.length === 0 ? (
          <div className="text-center py-32 border border-white/5 rounded-3xl">
            <Store className="w-12 h-12 mx-auto mb-4 text-white/10" />
            <p className="text-white/30 font-medium text-lg">Aucune boutique trouvée</p>
            <Link
              href="/boutiques"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-amber-400 text-black font-bold rounded-2xl hover:bg-amber-500 transition-all hover:scale-105 text-sm"
            >
              Voir toutes les boutiques <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {boutiques.map((boutique) => (
              <Link
                key={boutique.id}
                href={`/boutiques/${boutique.slug}`}
                className="group relative bg-white/3 rounded-2xl border border-white/5 hover:border-amber-400/20 overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-500/5"
              >
                {/* Bannière */}
                <div className="h-28 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent relative overflow-hidden">
                  {boutique.banniere_url ? (
                    <Image src={boutique.banniere_url} alt={boutique.nom} fill className="object-cover group-hover:scale-110 transition duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent" />
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />

                  {/* Logo */}
                  <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl bg-[#0f0f0f] border border-white/10 flex items-center justify-center overflow-hidden shadow-xl">
                    {boutique.logo_url ? (
                      <Image src={boutique.logo_url} alt={boutique.nom} fill className="object-cover" />
                    ) : (
                      <Store className="text-amber-400 w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Infos */}
                <div className="pt-8 p-4">
                  <p className="font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                    {boutique.nom}
                  </p>

                  {boutique.ville && (
                    <p className="text-xs text-white/30 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 text-amber-400/60" />
                      {boutique.ville}
                    </p>
                  )}

                  {boutique.description && (
                    <p className="text-xs text-white/25 line-clamp-2 leading-relaxed mb-3">
                      {boutique.description}
                    </p>
                  )}

                  {/* Footer carte */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[11px] text-white/20">
                      {boutique.produits?.[0]?.count || 0} produit{(boutique.produits?.[0]?.count || 0) > 1 ? 's' : ''}
                    </span>
                    <span className="text-[11px] text-amber-400/60 flex items-center gap-1 group-hover:gap-2 transition-all">
                      Voir <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Ligne dorée bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}