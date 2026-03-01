export interface Profile { 
   id: string 
   role: 'acheteur' | 'vendeur' | 'admin' 
   nom_complet: string | null 
   telephone: string | null 
   ville: string | null 
   avatar_url: string | null 
   created_at: string 
 } 
 
 export interface Boutique { 
   id: string 
   vendeur_id: string 
   nom: string 
   slug: string 
   description: string | null 
   logo_url: string | null 
   ville: string | null 
   telephone: string | null 
   whatsapp: string 
   statut: string 
   created_at: string 
 } 
 
 export interface Produit { 
   id: string 
   boutique_id: string 
   nom: string 
   slug: string 
   description: string | null 
   prix: number 
   images: string[] 
   categorie: string | null 
   statut: string 
   boutique?: Boutique 
   created_at: string 
 } 
