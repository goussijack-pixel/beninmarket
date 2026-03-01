import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { MapPin, Store, ArrowLeft, Sparkles, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import GalerieImages from '@/components/produits/GalerieImages'
import BoutonAjouterPanier from '@/components/panier/BoutonAjouterPanier'
import BoutonWhatsAppDirect from '@/components/produits/BoutonWhatsAppDirect'

export default async function DetailProduitPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: produit } = await supabase
    .from('produits')
    .select(`*, boutique:boutiques(*)`)
    .eq('slug', slug)
    .single()

  if (!produit) notFound()

  const messageWhatsApp = encodeURIComponent(
    `Bonjour ! Je suis intéressé(e) par votre produit "${produit.nom}" à ${produit.prix.toLocaleString('fr-FR')} FCFA sur BéninMarket. Est-il toujours disponible ?`
  )

  const lienWhatsApp = `https://wa.me/${produit.boutique?.whatsapp?.replace(/\D/g, '')}?text=${messageWhatsApp}`

  const enRupture = !produit.stock_illimite && (produit.stock || 0) === 0

  return (
    <div className="min-h-screen bg-[#0a0a0a]">

      {/* Effets lumineux */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">

        {/* Retour */}
        <Link
          href="/produits"
          className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-amber-400 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour aux produits
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* ─── GALERIE ─── */}
          <div className="rounded-3xl overflow-hidden border border-white/5 bg-white/3">
            <GalerieImages images={produit.images || []} nom={produit.nom} />
          </div>

          {/* ─── INFOS ─── */}
          <div className="flex flex-col gap-5">

            {/* Badge catégorie */}
            {produit.categorie && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-400/25 bg-amber-400/5 text-amber-300 text-xs font-medium w-fit">
                <Sparkles className="w-3 h-3" />
                {produit.categorie}
              </div>
            )}

            {/* Nom */}
            <h1 className="text-3xl font-black text-white leading-tight">{produit.nom}</h1>

            {/* Prix */}
            <div>
              <p className="text-4xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                {produit.prix.toLocaleString('fr-FR')} FCFA
              </p>
            </div>

            {/* Statut stock */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border w-fit
              ${enRupture
                ? 'bg-red-500/8 border-red-500/20'
                : 'bg-green-500/8 border-green-500/20'
              }">
              {produit.stock_illimite ? (
                <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  En stock — Illimité
                </div>
              ) : (produit.stock || 0) > 0 ? (
                <div className="flex items-center gap-2 text-orange-400 text-sm font-semibold">
                  <AlertCircle className="w-4 h-4" />
                  {produit.stock} article{produit.stock > 1 ? 's' : ''} restant{produit.stock > 1 ? 's' : ''}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                  <XCircle className="w-4 h-4" />
                  Rupture de stock
                </div>
              )}
            </div>

            {/* Description */}
            {produit.description && (
              <p className="text-white/40 leading-relaxed text-sm border-l-2 border-amber-400/30 pl-4">
                {produit.description}
              </p>
            )}

            {/* Séparateur */}
            <div className="h-[1px] bg-white/5" />

            {/* Boutons */}
            <div className="flex flex-col gap-3">
              <BoutonAjouterPanier produit={produit} fullWidth />
              <BoutonWhatsAppDirect produit={produit} lienWhatsApp={lienWhatsApp} />
            </div>

            <p className="text-xs text-white/20 text-center">
              Vous serez redirigé vers WhatsApp pour contacter le vendeur
            </p>

            {/* Infos boutique */}
            {produit.boutique && (
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mt-2 hover:border-amber-400/20 transition-colors group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden flex-shrink-0">
                    {produit.boutique.logo_url ? (
                      <Image src={produit.boutique.logo_url} alt={produit.boutique.nom} fill className="object-cover" />
                    ) : (
                      <Store className="text-amber-400 w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-white">{produit.boutique.nom}</p>
                      <div className="px-1.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      </div>
                    </div>
                    {produit.boutique.ville && (
                      <p className="text-xs text-white/30 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-amber-400/50" />
                        {produit.boutique.ville}
                      </p>
                    )}
                  </div>
                </div>
                <Link
                  href={`/boutiques/${produit.boutique.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 border border-white/8 rounded-xl text-white/50 hover:text-amber-400 hover:border-amber-400/30 text-sm font-medium transition-all"
                >
                  <Package className="w-4 h-4" />
                  Voir la boutique
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}