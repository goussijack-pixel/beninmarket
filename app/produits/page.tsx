import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Search, SlidersHorizontal, Sparkles, MapPin, ArrowRight } from 'lucide-react'

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('produits')
    .select(`*, boutique:boutiques(id, nom, slug, whatsapp, ville)`)
    .eq('statut', 'actif')
    .order('created_at', { ascending: false })

  let nomCategorieAffiche = ''
  if (params.categorie) {
    const mapCategories: Record<string, string> = {
      'mode': 'Mode & Vêtements',
      'electronique': 'Électronique',
      'alimentation': 'Alimentation',
      'maison': 'Maison & Déco',
      'beaute': 'Beauté & Santé',
      'agriculture': 'Agriculture',
      'artisanat': 'Artisanat',
      'services': 'Services',
      'autre': 'Autre',
    }
    nomCategorieAffiche = mapCategories[params.categorie] || params.categorie
    query = query.eq('categorie', nomCategorieAffiche)
  }

  if (params.q) {
    query = query.ilike('nom', `%${params.q}%`)
  }

  const { data: produits } = await query

  const categories = [
    { nom: 'Tout', slug: '', icone: '✨' },
    { nom: 'Mode', slug: 'mode', icone: '👗' },
    { nom: 'Électronique', slug: 'electronique', icone: '📱' },
    { nom: 'Alimentation', slug: 'alimentation', icone: '🍎' },
    { nom: 'Maison', slug: 'maison', icone: '🏠' },
    { nom: 'Beauté', slug: 'beaute', icone: '💄' },
    { nom: 'Agriculture', slug: 'agriculture', icone: '🌿' },
    { nom: 'Artisanat', slug: 'artisanat', icone: '🎨' },
    { nom: 'Services', slug: 'services', icone: '🔧' },
  ]

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
            {nomCategorieAffiche ? (
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-300 text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  Catégorie
                </div>
                <h1 className="text-3xl font-black text-white">{nomCategorieAffiche}</h1>
              </div>
            ) : params.q ? (
              <div>
                <p className="text-white/40 text-sm mb-1">Résultats de recherche</p>
                <h1 className="text-3xl font-black text-white">"{params.q}"</h1>
              </div>
            ) : (
              <div>
                <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-2">Découvrir</p>
                <h1 className="text-3xl md:text-4xl font-black text-white">Tous les produits</h1>
              </div>
            )}
            {produits && (
              <p className="text-white/30 text-sm mt-2">{produits.length} produit{produits.length > 1 ? 's' : ''} disponible{produits.length > 1 ? 's' : ''}</p>
            )}
          </div>

          {/* Barre de recherche */}
          <form method="GET" action="/produits" className="flex gap-3 max-w-2xl mb-7">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 w-4 h-4" />
              <input
                type="text"
                name="q"
                placeholder="Rechercher un produit..."
                defaultValue={params.q}
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

          {/* Filtres catégories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <SlidersHorizontal className="w-4 h-4 text-white/30 flex-shrink-0" />
            {categories.map((cat) => {
              const isActive = cat.slug === '' ? !params.categorie : params.categorie === cat.slug
              return (
                <Link
                  key={cat.slug}
                  href={cat.slug ? `/produits?categorie=${cat.slug}` : '/produits'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all flex-shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black border-transparent shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-white/50 border-white/8 hover:border-amber-400/30 hover:text-white hover:bg-white/8'
                  }`}
                >
                  <span>{cat.icone}</span>
                  {cat.nom}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* ─── GRILLE PRODUITS ─── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {!produits || produits.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-6">🔍</div>
            <p className="text-xl font-bold text-white mb-2">Aucun produit trouvé</p>
            <p className="text-white/30 text-sm mb-8">Revenez bientôt, de nouveaux produits arrivent !</p>
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-black font-bold rounded-2xl hover:bg-amber-500 transition-all hover:scale-105"
            >
              Voir tous les produits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {produits.map((produit, index) => (
              <Link
                key={produit.id}
                href={`/produits/${produit.slug}`}
                className="group relative bg-white/3 rounded-2xl border border-white/5 hover:border-amber-400/20 overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-500/5"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <div className="aspect-square bg-white/5 overflow-hidden relative">
                  {produit.images && produit.images[0] ? (
                    <Image
                      src={produit.images[0]}
                      alt={produit.nom}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      🛍️
                    </div>
                  )}

                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badge catégorie */}
                  {produit.categorie && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full text-[10px] text-white/70 font-medium border border-white/10">
                      {produit.categorie}
                    </div>
                  )}

                  {/* Badge nouveau */}
                  {index < 4 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-amber-400 rounded-full text-[10px] text-black font-bold">
                      NEW
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="p-3.5">
                  <p className="text-sm font-semibold text-white/80 line-clamp-2 leading-snug mb-2">
                    {produit.nom}
                  </p>
                  <p className="text-base font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                    {produit.prix.toLocaleString('fr-FR')} FCFA
                  </p>
                  {produit.boutique && (
                    <p className="text-[11px] text-white/25 mt-1.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {produit.boutique.ville || 'Bénin'}
                    </p>
                  )}
                </div>

                {/* Ligne dorée bottom au hover */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}