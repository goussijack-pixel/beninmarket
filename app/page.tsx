import Link from 'next/link'
import { Search, ShoppingBag, Store, MessageCircle, ArrowRight, Sparkles, TrendingUp, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const categories = [
    { nom: 'Mode & Vêtements', icone: '👗', slug: 'mode', couleur: 'from-rose-500/20 to-pink-500/10' },
    { nom: 'Électronique', icone: '📱', slug: 'electronique', couleur: 'from-blue-500/20 to-cyan-500/10' },
    { nom: 'Alimentation', icone: '🍎', slug: 'alimentation', couleur: 'from-green-500/20 to-emerald-500/10' },
    { nom: 'Maison & Déco', icone: '🏠', slug: 'maison', couleur: 'from-amber-500/20 to-yellow-500/10' },
    { nom: 'Beauté & Santé', icone: '💄', slug: 'beaute', couleur: 'from-fuchsia-500/20 to-purple-500/10' },
    { nom: 'Agriculture', icone: '🌿', slug: 'agriculture', couleur: 'from-lime-500/20 to-green-500/10' },
    { nom: 'Artisanat', icone: '🎨', slug: 'artisanat', couleur: 'from-orange-500/20 to-red-500/10' },
    { nom: 'Services', icone: '🔧', slug: 'services', couleur: 'from-slate-500/20 to-gray-500/10' },
    { nom: 'Autre', icone: '📦', slug: 'autre', couleur: 'from-indigo-500/20 to-violet-500/10' },
  ]

  const stats = [
    { valeur: '2,500+', label: 'Produits', icone: <ShoppingBag className="w-5 h-5" /> },
    { valeur: '300+', label: 'Vendeurs', icone: <Store className="w-5 h-5" /> },
    { valeur: '12', label: 'Villes', icone: <TrendingUp className="w-5 h-5" /> },
    { valeur: '100%', label: 'Sécurisé', icone: <Shield className="w-5 h-5" /> },
  ]

  return (
    <div className="overflow-hidden">

      {/* ─── HERO ─── */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 bg-[#0a0a0a]">

        {/* Fond animé doré */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-yellow-500/5 blur-[150px]" />
          {/* Grain texture */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz4=')]" />
        </div>

        {/* Ligne décorative dorée */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/5 text-amber-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            La marketplace #1 du Bénin 🇧🇯
          </div>

          {/* Titre principal */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
            Achetez & Vendez
            <span className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Made in Bénin
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Des milliers de produits authentiques. Paiement via MTN MoMo & Moov Money. Livraison partout au Bénin.
          </p>

          {/* Barre de recherche premium */}
          <div className="flex gap-3 max-w-xl mx-auto mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/30 text-base focus:outline-none focus:border-amber-400/50 focus:bg-white/8 backdrop-blur-sm transition-all"
              />
            </div>
            <Button className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-black font-bold rounded-2xl px-7 py-4 h-auto shadow-lg shadow-amber-500/20 transition-all hover:scale-105 hover:shadow-amber-500/30">
              Chercher
            </Button>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/produits">
              <Button className="bg-white text-black hover:bg-white/90 font-semibold px-8 py-4 h-auto rounded-2xl gap-2 transition-all hover:scale-105">
                Explorer les produits
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/boutiques">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 font-semibold px-8 py-4 h-auto rounded-2xl gap-2 backdrop-blur-sm transition-all hover:scale-105">
                <Store className="w-4 h-4" />
                Voir les boutiques
              </Button>
            </Link>
          </div>
        </div>

        {/* Ligne décorative bas */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-1">
              <div className="text-black/50 mb-1">{stat.icone}</div>
              <p className="text-3xl font-black text-black">{stat.valeur}</p>
              <p className="text-sm font-medium text-black/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CATÉGORIES ─── */}
      <section className="bg-[#0f0f0f] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-2">Découvrir</p>
              <h2 className="text-3xl md:text-4xl font-black text-white">Parcourir par catégorie</h2>
            </div>
            <Link href="/produits" className="text-white/40 hover:text-amber-400 text-sm font-medium flex items-center gap-1 transition-colors">
              Tout voir <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-9 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/produits?categorie=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/3 hover:border-amber-400/30 hover:bg-gradient-to-b hover:from-amber-400/5 hover:to-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-400/5"
              >
                <span className="text-3xl group-hover:scale-125 transition-transform duration-300 filter drop-shadow-lg">
                  {cat.icone}
                </span>
                <span className="text-[10px] text-center text-white/40 group-hover:text-amber-300 font-medium transition-colors leading-tight">
                  {cat.nom}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMENT ÇA MARCHE ─── */}
      <section className="bg-[#0a0a0a] py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[80px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Simple & Rapide</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Comment ça marche ?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                icon: <Search className="w-6 h-6" />,
                titre: 'Cherchez',
                desc: 'Parcourez des milliers de produits vendus par des commerçants béninois authentiques',
                couleur: 'from-blue-500/20 to-blue-600/5',
                border: 'border-blue-500/20',
              },
              {
                num: '02',
                icon: <MessageCircle className="w-6 h-6" />,
                titre: 'Contactez',
                desc: 'Contactez directement le vendeur via WhatsApp pour discuter et commander',
                couleur: 'from-amber-500/20 to-amber-600/5',
                border: 'border-amber-500/20',
              },
              {
                num: '03',
                icon: <ShoppingBag className="w-6 h-6" />,
                titre: 'Recevez',
                desc: 'Recevez votre commande à Cotonou ou dans votre ville au Bénin',
                couleur: 'from-emerald-500/20 to-emerald-600/5',
                border: 'border-emerald-500/20',
              },
            ].map((step, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-3xl bg-gradient-to-br ${step.couleur} border ${step.border} group hover:scale-105 transition-all duration-300`}
              >
                <div className="absolute top-6 right-6 text-6xl font-black text-white/5 group-hover:text-white/8 transition-colors">
                  {step.num}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-5">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.titre}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA VENDEUR ─── */}
      <section className="bg-[#0f0f0f] py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Fond doré animé */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgwLDAsMCwwLjEpIi8+PC9zdmc+')] opacity-30" />
            <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/10 blur-[80px]" />

            <div className="relative z-10 p-12 md:p-16 text-center">
              <div className="w-16 h-16 bg-black/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-black mb-4">
                Vous êtes commerçant ?
              </h2>
              <p className="text-black/60 text-lg mb-8 max-w-xl mx-auto">
                Créez votre boutique gratuite en 2 minutes et commencez à vendre à des milliers de clients aujourd'hui
              </p>
              <Link href="/inscription">
                <Button className="bg-black text-white hover:bg-black/80 font-bold px-10 py-5 h-auto rounded-2xl text-base gap-2 shadow-xl transition-all hover:scale-105">
                  Ouvrir ma boutique gratuitement
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}