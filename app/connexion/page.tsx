'use client' 
 
 import { useState } from 'react' 
 import { useRouter } from 'next/navigation' 
 import Link from 'next/link' 
 import { supabase } from '@/lib/supabase/client' 
 import { Button } from '@/components/ui/button' 
 import { Input } from '@/components/ui/input' 
 import { Label } from '@/components/ui/label' 
 import { ShoppingBag } from 'lucide-react' 
 
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
 
     // Vérifier le rôle pour rediriger 
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
     <div className="min-h-[calc(100-vh-4rem)] bg-gray-50 flex items-center justify-center px-4 py-12"> 
       <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-md"> 
         
         {/* Logo */} 
         <div className="flex items-center justify-center gap-2 mb-8"> 
           <ShoppingBag className="text-primary w-8 h-8" /> 
           <span className="font-bold text-2xl text-primary">BéninMarket</span> 
         </div> 
 
         <h1 className="text-xl font-bold text-gray-900 text-center mb-6"> 
           Connexion à votre compte 
         </h1> 
 
         {erreur && ( 
           <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4"> 
             {erreur} 
           </div> 
         )} 
 
         <form onSubmit={handleConnexion} className="space-y-4"> 
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
               placeholder="••••••••" 
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
             {chargement ? 'Connexion...' : 'Se connecter'} 
           </Button> 
         </form> 
 
         <p className="text-center text-sm text-gray-500 mt-6"> 
           Pas encore de compte ?{' '} 
           <Link href="/inscription" className="text-primary font-medium hover:underline"> 
             S'inscrire 
           </Link> 
         </p> 
       </div> 
     </div> 
   ) 
 } 
