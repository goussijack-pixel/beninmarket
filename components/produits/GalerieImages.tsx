'use client' 
 
 import { useState, useEffect } from 'react' 
 import Image from 'next/image' 
 import { ChevronLeft, ChevronRight } from 'lucide-react' 
 
 export default function GalerieImages({ images, nom }: { images: string[], nom: string }) { 
   const [imageActive, setImageActive] = useState(0) 
 
   // Défilement automatique toutes les 3 secondes 
   useEffect(() => { 
     if (images.length <= 1) return 
     const interval = setInterval(() => { 
       setImageActive(prev => (prev + 1) % images.length) 
     }, 3000) 
     return () => clearInterval(interval) 
   }, [images.length]) 
 
   if (!images || images.length === 0) { 
     return ( 
       <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-7xl"> 
         🛍️ 
       </div> 
     ) 
   } 
 
   return ( 
     <div className="space-y-3"> 
       {/* Image principale */} 
       <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group"> 
         <Image 
           src={images[imageActive]} 
           alt={`${nom} - image ${imageActive + 1}`} 
           fill 
           className="object-cover transition-all duration-500" 
         /> 
 
         {/* Flèches navigation */} 
         {images.length > 1 && ( 
           <> 
             <button 
               onClick={() => setImageActive(prev => (prev - 1 + images.length) % images.length)} 
               className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow" 
             > 
               <ChevronLeft className="w-5 h-5 text-gray-700" /> 
             </button> 
             <button 
               onClick={() => setImageActive(prev => (prev + 1) % images.length)} 
               className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition shadow" 
             > 
               <ChevronRight className="w-5 h-5 text-gray-700" /> 
             </button> 
           </> 
         )} 
 
         {/* Indicateurs points */} 
         {images.length > 1 && ( 
           <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"> 
             {images.map((_, i) => ( 
               <button 
                 key={i} 
                 onClick={() => setImageActive(i)} 
                 className={`w-2 h-2 rounded-full transition ${ 
                   i === imageActive ? 'bg-white scale-125' : 'bg-white/50' 
                 }`} 
               /> 
             ))} 
           </div> 
         )} 
       </div> 
 
       {/* Miniatures cliquables */} 
       {images.length > 1 && ( 
         <div className="flex gap-2 overflow-x-auto pb-1"> 
           {images.map((img, i) => ( 
             <button 
               key={i} 
               onClick={() => setImageActive(i)} 
               className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${ 
                 imageActive === i ? 'border-primary' : 'border-transparent hover:border-gray-300' 
               }`} 
             > 
               <Image src={img} alt={`${nom} ${i + 1}`} fill className="object-cover" /> 
             </button> 
           ))} 
         </div> 
       )} 
     </div> 
   ) 
 } 
