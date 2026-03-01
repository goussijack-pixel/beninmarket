'use client' 
 
 import { useState } from 'react' 
 import { Copy, Check } from 'lucide-react' 
 import { Button } from '@/components/ui/button' 
 
 export default function BoutonCopierLien({ slug }: { slug: string }) { 
   const [copie, setCopie] = useState(false) 
 
   const copierLien = async () => { 
     const lien = `${window.location.origin}/boutiques/${slug}` 
     await navigator.clipboard.writeText(lien) 
     setCopie(true) 
     setTimeout(() => setCopie(false), 2000) 
   } 
 
   return ( 
     <Button 
       onClick={copierLien} 
       variant="outline" 
       className="gap-2" 
     > 
       {copie ? ( 
         <> 
           <Check className="w-4 h-4 text-green-500" /> 
           Lien copié ! 
         </> 
       ) : ( 
         <> 
           <Copy className="w-4 h-4" /> 
           Copier le lien 
         </> 
       )} 
     </Button> 
   ) 
 } 
