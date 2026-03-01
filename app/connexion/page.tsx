'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ShoppingBag, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'

export default function ConnexionPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')

  const handleConnexion = async (e: React.FormEvent) => {
    e.preventDefault()
    setChargement(true)
    setErreur('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    })

    if (error) {
      setErreur('Email ou mot de passe incorrect')
      setChargement(false)
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'vendeur') {
      router.push('/vendeur/dashboard')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Effets lumineux */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-orange-500/8 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Card principale */}
        <div className="bg-white/3 border border-white/8 rounded-3xl p-8 backdrop-blur-sm shadow-2xl shadow-black/50">

          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30">
              <ShoppingBag className="w-7 h-7 text-black" />
            </div>
            <span className="font-black text-2xl bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              BéninMarket
            </span>
          </div>

          <h1 className="text-xl font-black text-white text-center mb-1">
            Bon retour 👋
          </h1>
          <p className="text-white/30 text-sm text-center mb-8">
            Connectez-vous à votre compte
          </p>

          {/* Erreur */}
          {erreur && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3.5 rounded-xl mb-5">
              {erreur}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleConnexion} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={chargement}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-xl hover:from-amber-500 hover:to-orange-600 transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              {chargement ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-white/5" />
            <span className="text-white/20 text-xs">ou</span>
            <div className="flex-1 h-[1px] bg-white/5" />
          </div>

          {/* Lien inscription */}
          <div className="text-center">
            <p className="text-white/30 text-sm">
              Pas encore de compte ?{' '}
              <Link href="/inscription" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                S'inscrire
              </Link>
            </p>
          </div>

          {/* CTA vendeur */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-400/5 border border-amber-400/15">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-white/50">Vous êtes commerçant ?</p>
                <Link href="/inscription" className="text-xs text-amber-400 hover:text-amber-300 transition-colors">
                  Créez votre boutique gratuitement →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Lien retour */}
        <p className="text-center text-white/20 text-xs mt-6">
          <Link href="/" className="hover:text-white/40 transition-colors">
            ← Retour à l'accueil
          </Link>
        </p>
      </div>
    </div>
  )
}