import Link from 'next/link'
import { ShoppingBag, MapPin, Phone, Mail, ArrowRight, Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">

      {/* Effets lumineux */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[200px] rounded-full bg-amber-500/5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] rounded-full bg-orange-500/5 blur-[80px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-8">

        {/* CTA bannière */}
        <div className="relative rounded-3xl overflow-hidden mb-14 p-8 md:p-10">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-orange-400/5 to-transparent border border-amber-400/15 rounded-3xl" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-2">Rejoignez-nous</p>
              <h3 className="text-2xl font-black text-white">Vous êtes commerçant ?</h3>
              <p className="text-white/40 text-sm mt-1">Créez votre boutique gratuitement en 2 minutes</p>
            </div>
            <Link
              href="/inscription"
              className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-2xl hover:from-amber-500 hover:to-orange-600 transition-all hover:scale-105 shadow-lg shadow-amber-500/20 whitespace-nowrap flex-shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Ouvrir ma boutique
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Logo + description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-4 h-4 text-black" />
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                BéninMarket
              </span>
            </Link>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs">
              La marketplace premium made in Bénin. Achetez et vendez facilement avec paiement MTN MoMo & Moov Money.
            </p>
            {/* Badges paiement */}
            <div className="flex gap-2 mt-5">
              <div className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-xs font-semibold">
                MTN MoMo
              </div>
              <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-xs font-semibold">
                Moov Money
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Navigation</h3>
            <ul className="space-y-3">
              {[
                { label: 'Tous les produits', href: '/produits' },
                { label: 'Les boutiques', href: '/boutiques' },
                { label: 'Devenir vendeur', href: '/inscription' },
                { label: 'Connexion', href: '/connexion' },
              ].map((lien) => (
                <li key={lien.href}>
                  <Link
                    href={lien.href}
                    className="text-white/35 hover:text-amber-400 text-sm transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {lien.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-white/35 text-sm">Cotonou, Bénin</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <a href="https://wa.me/22901694687​80" className="text-white/35 hover:text-amber-400 text-sm transition-colors">
                  +229 01 69 46 87 80
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <a href="mailto:contact@beninmarket.bj" className="text-white/35 hover:text-amber-400 text-sm transition-colors">
                  contact@beninmarket.bj
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ligne séparatrice */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-sm">
            © 2025 BéninMarket — Tous droits réservés 🇧🇯
          </p>
          <div className="flex items-center gap-1 text-white/20 text-xs">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>au Bénin</span>
          </div>
        </div>
      </div>
    </footer>
  )
}