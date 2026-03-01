import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import BoutonCopierLien from '@/components/shared/BoutonCopierLien'
import BoutonAjouterPanier from '@/components/panier/BoutonAjouterPanier'
import { MapPin, Phone, MessageCircle, Store, ArrowLeft, Sparkles, Package } from 'lucide-react'
import { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: boutique } = await supabase
    .from('boutiques')
    .select('nom, description, statut')
    .eq('slug', slug)
    .single()

  if (!boutique || boutique.statut !== 'actif') return { title: 'Boutique non trouvée' }

  return {
    title: `${boutique.nom} | BéninMarket`,
    description: boutique.description || `Découvrez les produits de ${boutique.nom} sur BéninMarket.`,
    openGraph: {
      title: boutique.nom,
      description: boutique.description || `Visitez ma boutique sur BéninMarket.`,
      type: 'website',
    }
  }
}

export default async function PageBoutique({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ categorie?: string }>
}) {
  const { slug } = await params
  const { categorie } = await searchParams
  const supabase = await createClient()

  const { data: boutique, error } = await supabase
    .from('boutiques')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !boutique) notFound()
  if (boutique.statut !== 'actif') notFound()

  const { data: toutesCategories, error: errorCategories } = await supabase
    .from('produits')
    .select('categorie')
    .eq('boutique_id', boutique.id)
    .eq('statut', 'actif')

  if (errorCategories) console.error('Erreur chargement catégories:', errorCategories)

  const categoriesUniques = Array.from(
    new Set(toutesCategories?.map((p) => p.categorie).filter(Boolean))
  ).sort()

  let query = supabase
    .from('produits')
    .select('*')
    .eq('boutique_id', boutique.id)
    .eq('statut', 'actif')

  if (categorie) query = query.eq('categorie', categorie)

  const { data: produits, error: errorProduits } = await query.order('created_at', { ascending: false })
  if (errorProduits) console.error('Erreur chargement produits:', errorProduits)

  const messageWhatsApp = encodeURIComponent(
    `Bonjour ! J'ai visité votre boutique "${boutique.nom}" sur BéninMarket et j'aimerais avoir plus d'informations.`
  )
  const lienWhatsApp = `https://wa.me/${boutique.whatsapp?.replace(/\D/g, '')}?text=${messageWhatsApp}`

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* ─── HERO BOUTIQUE ─── */}
      <div className="relative overflow-hidden border-b border-white/5">
        {/* Fond lumineux */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[120px]" />
          <div className="absolute top-[-30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-orange-500/8 blur-[100px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-8 pb-10">

          {/* Retour */}
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-amber-400 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour aux produits
          </Link>

          {/* Infos boutique */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="flex items-start gap-5">

              {/* Logo */}
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-xl">
                {boutique.logo_url ? (
                  <Image src={boutique.logo_url} alt={boutique.nom} fill className="object-cover" />
                ) : (
                  <Store className="text-amber-400 w-9 h-9" />
                )}
              </div>

              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-400/25 bg-amber-400/5 text-amber-300 text-xs font-medium mb-3">
                  <Sparkles className="w-3 h-3" />
                  Boutique vérifiée
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-white mb-3">{boutique.nom}</h1>

                <div className="flex flex-wrap gap-4">
                  {boutique.ville && (
                    <span className="text-sm text-white/35 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {boutique.ville}
                    </span>
                  )}
                  {boutique.telephone && (
                    <span className="text-sm text-white/35 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      {boutique.telephone}
                    </span>
                  )}
                  <span className="text-sm text-white/35 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-400" />
                    {produits?.length || 0} produit{(produits?.length || 0) > 1 ? 's' : ''}
                  </span>
                </div>

                {boutique.description && (
                  <p className="text-white/40 text-sm leading-relaxed mt-4 max-w-xl">
                    {boutique.description}
                  </p>
                )}
              </div>
            </div>

            {/* Boutons actions */}
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <BoutonCopierLien slug={slug} />
              {boutique.whatsapp && (
                <a href={lienWhatsApp} target="_blank" rel="noopener noreferrer">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25 rounded-xl text-sm font-semibold transition-all hover:scale-105">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── PRODUITS ─── */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Filtres */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-white">
              {categorie ? categorie : 'Tous les produits'}
              <span className="text-white/25 font-normal text-base ml-2">({produits?.length || 0})</span>
            </h2>
          </div>

          {categoriesUniques.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <Link
                href={`/boutiques/${slug}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border transition-all flex-shrink-0 ${
                  !categorie
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black border-transparent shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-white/40 border-white/8 hover:border-amber-400/30 hover:text-white'
                }`}
              >
                ✨ Tous
              </Link>
              {categoriesUniques.map((cat) => (
                <Link
                  key={cat}
                  href={`/boutiques/${slug}?categorie=${encodeURIComponent(cat)}`}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border transition-all flex-shrink-0 ${
                    categorie === cat
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black border-transparent shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 text-white/40 border-white/8 hover:border-amber-400/30 hover:text-white'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Grille produits */}
        {!produits || produits.length === 0 ? (
          <div className="text-center py-24 border border-white/5 rounded-3xl">
            <div className="text-5xl mb-4">🛍️</div>
            <p className="text-white/40 font-medium">Cette boutique n'a pas encore de produits</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {produits.map((produit) => {
              const produitAvecBoutique = { ...produit, boutique }
              return (
                <div
                  key={produit.id}
                  className="group relative bg-white/3 rounded-2xl border border-white/5 hover:border-amber-400/20 overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col"
                >
                  <Link href={`/produits/${produit.slug}`} className="flex flex-col flex-1">
                    {/* Image */}
                    <div className="aspect-square bg-white/5 overflow-hidden relative">
                      {produit.images?.[0] ? (
                        <Image
                          src={produit.images[0]}
                          alt={produit.nom}
                          fill
                          className="object-cover group-hover:scale-110 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
                      )}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Badge catégorie */}
                      {produit.categorie && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded-full text-[10px] text-white/70 font-medium border border-white/10">
                          {produit.categorie}
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="p-3.5 flex-1 flex flex-col">
                      <p className="text-sm font-semibold text-white/80 line-clamp-2 leading-snug mb-2">
                        {produit.nom}
                      </p>
                      <p className="text-base font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent mb-3">
                        {produit.prix.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                  </Link>

                  {/* Bouton panier */}
                  <div className="px-3.5 pb-3.5">
                    <BoutonAjouterPanier produit={produitAvecBoutique} fullWidth />
                  </div>

                  {/* Ligne dorée bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}