'use client' 
 
 import { useState } from 'react' 
 import { useRouter } from 'next/navigation' 
 import Link from 'next/link' 
 import { supabase } from '@/lib/supabase/client' 
 import { Button } from '@/components/ui/button' 
 import { Input } from '@/components/ui/input' 
 import { Label } from '@/components/ui/label' 
 import { ShoppingBag, Store, User } from 'lucide-react' 
 
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
 
     // 1. Inscription Auth 
     const { data, error: authError } = await supabase.auth.signUp({ 
       email, 
       password: motDePasse, 
       options: { 
         data: { 
           nom_complet: nomComplet, 
           role: role, 
         } 
       } 
     }) 
 
     if (authError) { 
       setErreur(authError.message) 
       setChargement(false) 
       return 
     } 
 
     if (data.user) { 
       // Le profil est créé automatiquement via le trigger Supabase 
       // On met juste à jour le rôle si c'est un vendeur 
       if (role === 'vendeur') { 
         await supabase 
           .from('profiles') 
           .update({ role: 'vendeur' }) 
           .eq('id', data.user.id) 
       } 
 
       setSucces(true) 
       setChargement(false) 
       
       // Redirection après 2 secondes 
       setTimeout(() => { 
         router.push('/connexion') 
       }, 2000) 
     } 
   } 
 
   if (succes) { 
     return ( 
       <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4"> 
         <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-md text-center"> 
           <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"> 
             <ShoppingBag className="w-8 h-8" /> 
           </div> 
           <h1 className="text-2xl font-bold text-gray-900 mb-2">Compte créé !</h1> 
           <p className="text-gray-500 mb-6"> 
             Votre compte a été créé avec succès. Vous allez être redirigé vers la page de connexion. 
           </p> 
           <Link href="/connexion"> 
             <Button className="w-full bg-primary hover:bg-primary/90 text-white"> 
               Aller à la connexion 
             </Button> 
           </Link> 
         </div> 
       </div> 
     ) 
   } 
 
   return ( 
     <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-12"> 
       <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-md"> 
         
         {/* Logo */} 
         <div className="flex items-center justify-center gap-2 mb-8"> 
           <ShoppingBag className="text-primary w-8 h-8" /> 
           <span className="font-bold text-2xl text-primary">BéninMarket</span> 
         </div> 
 
         <h1 className="text-xl font-bold text-gray-900 text-center mb-6"> 
           Créer votre compte 
         </h1> 
 
         {erreur && ( 
           <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4"> 
             {erreur} 
           </div> 
         )} 
 
         {/* Sélecteur de rôle */} 
         <div className="grid grid-cols-2 gap-4 mb-6"> 
           <button 
             type="button" 
             onClick={() => setRole('acheteur')} 
             className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition ${role === 'acheteur' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-white hover:border-gray-300'}`} 
           > 
             <User className={`w-5 h-5 ${role === 'acheteur' ? 'text-primary' : 'text-gray-400'}`} /> 
             <span className={`text-sm font-medium ${role === 'acheteur' ? 'text-primary' : 'text-gray-600'}`}>Acheteur</span> 
           </button> 
           <button 
             type="button" 
             onClick={() => setRole('vendeur')} 
             className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition ${role === 'vendeur' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-white hover:border-gray-300'}`} 
           > 
             <Store className={`w-5 h-5 ${role === 'vendeur' ? 'text-primary' : 'text-gray-400'}`} /> 
             <span className={`text-sm font-medium ${role === 'vendeur' ? 'text-primary' : 'text-gray-600'}`}>Vendeur</span> 
           </button> 
         </div> 
 
         <form onSubmit={handleInscription} className="space-y-4"> 
           <div> 
             <Label htmlFor="nomComplet">Nom complet</Label> 
             <Input 
               id="nomComplet" 
               placeholder="Ex: Jean Dupont" 
               value={nomComplet} 
               onChange={(e) => setNomComplet(e.target.value)} 
               required 
               className="mt-1" 
             /> 
           </div> 
 
           <div> 
             <Label htmlFor="email">Email</Label> 
             <Input 
               id="email" 
               type="email" 
               placeholder="votre@email.com" 
               value={email} 
               onChange={(e) => setEmail(e.target.value)} 
               required 
               className="mt-1" 
             /> 
           </div> 
 
           <div> 
             <Label htmlFor="motDePasse">Mot de passe</Label> 
             <Input 
               id="motDePasse" 
               type="password" 
               placeholder="Min. 6 caractères" 
               value={motDePasse} 
               onChange={(e) => setMotDePasse(e.target.value)} 
               required 
               className="mt-1" 
             /> 
           </div> 
 
           <Button 
             type="submit" 
             className="w-full bg-primary hover:bg-primary/90 text-white py-5" 
             disabled={chargement} 
           > 
             {chargement ? 'Création...' : "S'inscrire"} 
           </Button> 
         </form> 
 
         <p className="text-center text-sm text-gray-500 mt-6"> 
           Déjà un compte ?{' '} 
           <Link href="/connexion" className="text-primary font-medium hover:underline"> 
             Se connecter 
           </Link> 
         </p> 
       </div> 
     </div> 
   ) 
 } 
