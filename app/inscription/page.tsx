'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { ShoppingBag, Mail, Lock, User, Store, ArrowRight, Sparkles, CheckCircle } from 'lucide-react'

export default function InscriptionPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [nomComplet, setNomComplet] = useState('')
  const [role, setRole] = useState<'acheteur' | 'vendeur'>('acheteur')
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState(false)

  const handleInscription = async (e: React.FormEvent) => {
    e.preventDefault()
    setChargement(true)
    setErreur('')

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password: motDePasse,
      options: {
        data: { nom_complet: nomComplet, role },
      },
    })

    if (authError) {
      setErreur(authError.message)
      setChargement(false)
      return
    }

    if (data.user) {
      if (role === 'vendeur') {
        await supabase.from('profiles').update({ role: 'vendeur' }).eq('id', data.user.id)
      }
      setSucces(true)
      setChargement(false)
      setTimeout(() => router.push('/connexion'), 2000)
    }
  }

  // ─── SUCCÈS ───
  if (succes) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/8 blur-[120px]" />
        </div>
        <div className="relative text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/30">
            <CheckCircle className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Compte créé ! 🎉</h1>
          <p className="text-white/40 mb-8 max-w-sm mx-auto">
            Votre compte a été créé avec succès. Vous allez être redirigé vers la connexion.
          </p>
          <Link
            href="/connexion"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-black font-bold rounded-2xl hover:from-amber-500 hover:to-orange-600 transition-all hover:scale-105 shadow-lg shadow-amber-500/20"
          >
            Aller à la connexion <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Effets lumineux */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/8 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-orange-500/8 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Card */}
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

          <h1 className="text-xl font-black text-white text-center mb-1">Créer votre compte</h1>
          <p className="text-white/30 text-sm text-center mb-8">Rejoignez la marketplace du Bénin 🇧🇯</p>

          {/* Erreur */}
          {erreur && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3.5 rounded-xl mb-5">
              {erreur}
            </div>
          )}

          {/* Sélecteur rôle */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('acheteur')}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all ${
                role === 'acheteur'
                  ? 'border-amber-400/50 bg-amber-400/8 shadow-lg shadow-amber-500/10'
                  : 'border-white/8 bg-white/3 hover:border-white/15'
              }`}
            >
              <User className={`w-5 h-5 ${role === 'acheteur' ? 'text-amber-400' : 'text-white/25'}`} />
              <span className={`text-sm font-semibold ${role === 'acheteur' ? 'text-amber-300' : 'text-white/30'}`}>
                Acheteur
              </span>
              {role === 'acheteur' && (
                <span className="text-[10px] text-amber-400/60">Je veux acheter</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setRole('vendeur')}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all ${
                role === 'vendeur'
                  ? 'border-amber-400/50 bg-amber-400/8 shadow-lg shadow-amber-500/10'
                  : 'border-white/8 bg-white/3 hover:border-white/15'
              }`}
            >
              <Store className={`w-5 h-5 ${role === 'vendeur' ? 'text-amber-400' : 'text-white/25'}`} />
              <span className={`text-sm font-semibold ${role === 'vendeur' ? 'text-amber-300' : 'text-white/30'}`}>
                Vendeur
              </span>
              {role === 'vendeur' && (
                <span className="text-[10px] text-amber-400/60">Je veux vendre</span>
              )}
            </button>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleInscription} className="space-y-4">

            {/* Nom */}
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 block">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Ex: Jean Dupont"
                  value={nomComplet}
                  onChange={(e) => setNomComplet(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/8 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-400/40 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

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
                  placeholder="Min. 6 caractères"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  required
                  minLength={6}
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
                  <Sparkles className="w-4 h-4" />
                  {role === 'vendeur' ? 'Créer ma boutique' : "S'inscrire"}
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

          <p className="text-center text-sm text-white/30">
            Déjà un compte ?{' '}
            <Link href="/connexion" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
              Se connecter
            </Link>
          </p>
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