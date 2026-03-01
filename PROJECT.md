# 🛒 BéninMarket — Marketplace E-commerce pour le Bénin

> **Document de référence complet pour Trae Solo**
> Stack : Next.js 14 · Supabase · Vercel · Tailwind CSS · TypeScript

---

## 🎯 Vision du Projet

BéninMarket est une marketplace e-commerce adaptée au contexte béninois permettant à des vendeurs locaux (commerçants, artisans, petites boutiques) de vendre leurs produits en ligne, et à des acheteurs de payer via mobile money (MTN MoMo, Moov Money). La plateforme est une alternative locale à Jumia, pensée pour les réalités africaines.

---

## 🏗️ Architecture Technique

### Stack Complète

```
Frontend   → Next.js 14 (App Router) + TypeScript + Tailwind CSS
Backend    → Supabase (PostgreSQL + Auth + Storage + Realtime)
Hébergement→ Vercel (Frontend) + Supabase Cloud (Backend)
Paiement   → FedaPay (agrégateur local : MTN MoMo, Moov Money, carte)
Email      → Resend (transactionnel)
Images     → Supabase Storage
UI Lib     → shadcn/ui + Lucide Icons
```

### Structure des Dossiers

```
beninmarket/
├── app/
│   ├── (public)/                   # Pages publiques (sans auth)
│   │   ├── page.tsx                # Homepage
│   │   ├── produits/
│   │   │   ├── page.tsx            # Catalogue produits
│   │   │   └── [slug]/page.tsx     # Détail produit
│   │   ├── boutiques/
│   │   │   ├── page.tsx            # Liste boutiques
│   │   │   └── [slug]/page.tsx     # Page boutique vendeur
│   │   ├── categories/
│   │   │   └── [slug]/page.tsx     # Produits par catégorie
│   │   ├── recherche/page.tsx      # Résultats de recherche
│   │   └── panier/page.tsx         # Panier d'achat
│   ├── (auth)/                     # Pages d'authentification
│   │   ├── connexion/page.tsx
│   │   ├── inscription/page.tsx
│   │   └── mot-de-passe-oublie/page.tsx
│   ├── (acheteur)/                 # Espace acheteur (auth requis)
│   │   ├── commandes/
│   │   │   ├── page.tsx            # Historique commandes
│   │   │   └── [id]/page.tsx       # Détail commande
│   │   ├── profil/page.tsx
│   │   └── checkout/page.tsx       # Tunnel d'achat
│   ├── (vendeur)/                  # Espace vendeur (auth requis)
│   │   ├── dashboard/page.tsx      # Vue d'ensemble vendeur
│   │   ├── produits/
│   │   │   ├── page.tsx            # Mes produits
│   │   │   ├── nouveau/page.tsx    # Ajouter produit
│   │   │   └── [id]/modifier/page.tsx
│   │   ├── commandes/page.tsx      # Commandes reçues
│   │   ├── boutique/page.tsx       # Paramètres boutique
│   │   └── paiements/page.tsx      # Historique revenus
│   ├── (admin)/                    # Back-office admin
│   │   ├── dashboard/page.tsx
│   │   ├── vendeurs/page.tsx       # Gestion vendeurs
│   │   ├── commandes/page.tsx
│   │   └── categories/page.tsx
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── fedapay/route.ts    # Webhook paiement
│   │   └── revalidate/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   └── Sidebar.tsx
│   ├── produits/
│   │   ├── CartesProduit.tsx
│   │   ├── GrillepProduits.tsx
│   │   ├── FiltresProduits.tsx
│   │   └── GalerieImages.tsx
│   ├── panier/
│   │   ├── PanierDrawer.tsx
│   │   └── ItemPanier.tsx
│   └── shared/
│       ├── SearchBar.tsx
│       ├── RatingStars.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Client browser
│   │   ├── server.ts               # Client server
│   │   └── middleware.ts
│   ├── fedapay.ts                  # Intégration paiement
│   ├── utils.ts
│   └── validations.ts              # Schémas Zod
├── hooks/
│   ├── usePanier.ts
│   ├── useAuth.ts
│   └── useProduits.ts
├── types/
│   └── index.ts                    # Types TypeScript globaux
├── middleware.ts                   # Auth middleware Next.js
├── next.config.js
├── tailwind.config.ts
└── supabase/
    ├── migrations/                 # Migrations SQL
    └── seed.sql                    # Données de test
```

---

## 🗄️ Base de Données Supabase (Schéma SQL)

### Tables Principales

```sql
-- ============================================
-- UTILISATEURS (géré par Supabase Auth)
-- ============================================
-- La table auth.users existe automatiquement
-- On crée un profil public lié

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'acheteur' CHECK (role IN ('acheteur', 'vendeur', 'admin')),
  nom_complet TEXT,
  telephone TEXT,
  ville TEXT,
  quartier TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOUTIQUES (une par vendeur)
-- ============================================
CREATE TABLE public.boutiques (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendeur_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  banniere_url TEXT,
  ville TEXT,
  quartier TEXT,
  telephone TEXT,
  whatsapp TEXT,
  statut TEXT DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'active', 'suspendue')),
  note_moyenne NUMERIC(3,2) DEFAULT 0,
  total_ventes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CATÉGORIES
-- ============================================
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icone TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES public.categories(id),
  ordre INTEGER DEFAULT 0
);

-- ============================================
-- PRODUITS
-- ============================================
CREATE TABLE public.produits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  boutique_id UUID REFERENCES public.boutiques(id) ON DELETE CASCADE NOT NULL,
  categorie_id UUID REFERENCES public.categories(id),
  nom TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  prix NUMERIC(10,0) NOT NULL, -- en FCFA
  prix_promo NUMERIC(10,0),
  stock INTEGER DEFAULT 0,
  unite TEXT DEFAULT 'pièce',
  images TEXT[] DEFAULT '{}',   -- tableau d'URLs
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'rupture')),
  est_vedette BOOLEAN DEFAULT FALSE,
  note_moyenne NUMERIC(3,2) DEFAULT 0,
  total_avis INTEGER DEFAULT 0,
  vues INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour la recherche full-text
CREATE INDEX produits_search_idx ON public.produits
USING GIN (to_tsvector('french', nom || ' ' || COALESCE(description, '')));

-- ============================================
-- COMMANDES
-- ============================================
CREATE TABLE public.commandes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT UNIQUE NOT NULL,  -- ex: BM-2024-001234
  acheteur_id UUID REFERENCES public.profiles(id),
  statut TEXT DEFAULT 'en_attente' CHECK (
    statut IN ('en_attente', 'payee', 'en_preparation', 'expediee', 'livree', 'annulee')
  ),
  -- Livraison
  adresse_livraison TEXT NOT NULL,
  ville_livraison TEXT NOT NULL,
  quartier_livraison TEXT,
  telephone_livraison TEXT NOT NULL,
  instructions_livraison TEXT,
  -- Paiement
  methode_paiement TEXT CHECK (methode_paiement IN ('mtn_momo', 'moov_money', 'carte')),
  statut_paiement TEXT DEFAULT 'non_paye' CHECK (
    statut_paiement IN ('non_paye', 'en_attente', 'paye', 'rembourse')
  ),
  reference_paiement TEXT,
  -- Montants
  sous_total NUMERIC(10,0) NOT NULL,
  frais_livraison NUMERIC(10,0) DEFAULT 0,
  total NUMERIC(10,0) NOT NULL,
  -- Commission plateforme
  commission NUMERIC(10,0) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LIGNES DE COMMANDE
-- ============================================
CREATE TABLE public.lignes_commande (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  commande_id UUID REFERENCES public.commandes(id) ON DELETE CASCADE,
  produit_id UUID REFERENCES public.produits(id),
  boutique_id UUID REFERENCES public.boutiques(id),
  nom_produit TEXT NOT NULL,   -- snapshot au moment de la commande
  prix_unitaire NUMERIC(10,0) NOT NULL,
  quantite INTEGER NOT NULL DEFAULT 1,
  total NUMERIC(10,0) NOT NULL,
  image_url TEXT
);

-- ============================================
-- AVIS / ÉVALUATIONS
-- ============================================
CREATE TABLE public.avis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  produit_id UUID REFERENCES public.produits(id) ON DELETE CASCADE,
  acheteur_id UUID REFERENCES public.profiles(id),
  commande_id UUID REFERENCES public.commandes(id),
  note INTEGER CHECK (note BETWEEN 1 AND 5),
  commentaire TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(commande_id, produit_id) -- un avis par produit par commande
);

-- ============================================
-- FAVORIS
-- ============================================
CREATE TABLE public.favoris (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  acheteur_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  produit_id UUID REFERENCES public.produits(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(acheteur_id, produit_id)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  destinataire_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,  -- 'nouvelle_commande', 'commande_livree', etc.
  titre TEXT NOT NULL,
  message TEXT,
  lu BOOLEAN DEFAULT FALSE,
  lien TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boutiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commandes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lignes_commande ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoris ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- PROFILES : lecture publique, écriture propriétaire
CREATE POLICY "Profils publics en lecture" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profil modifiable par propriétaire" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- BOUTIQUES : lecture publique, écriture par vendeur propriétaire
CREATE POLICY "Boutiques publiques" ON public.boutiques FOR SELECT USING (true);
CREATE POLICY "Boutique créée par vendeur" ON public.boutiques FOR INSERT WITH CHECK (auth.uid() = vendeur_id);
CREATE POLICY "Boutique modifiable par vendeur" ON public.boutiques FOR UPDATE USING (auth.uid() = vendeur_id);

-- PRODUITS : lecture publique, CRUD par vendeur propriétaire
CREATE POLICY "Produits publics" ON public.produits FOR SELECT USING (true);
CREATE POLICY "Produit créé par vendeur" ON public.produits FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM boutiques WHERE id = boutique_id AND vendeur_id = auth.uid())
);
CREATE POLICY "Produit modifiable par vendeur" ON public.produits FOR UPDATE USING (
  EXISTS (SELECT 1 FROM boutiques WHERE id = boutique_id AND vendeur_id = auth.uid())
);

-- COMMANDES : visible par acheteur ou vendeur concerné
CREATE POLICY "Commande visible par acheteur" ON public.commandes FOR SELECT USING (auth.uid() = acheteur_id);
CREATE POLICY "Commande créée par acheteur" ON public.commandes FOR INSERT WITH CHECK (auth.uid() = acheteur_id);

-- FAVORIS : gérés par acheteur
CREATE POLICY "Favoris gérés par acheteur" ON public.favoris FOR ALL USING (auth.uid() = acheteur_id);

-- NOTIFICATIONS : lecture par destinataire
CREATE POLICY "Notifs destinataire" ON public.notifications FOR ALL USING (auth.uid() = destinataire_id);
```

---

## 🔐 Authentification

### Stratégie

- Supabase Auth (email/password)
- Rôles : `acheteur`, `vendeur`, `admin`
- Middleware Next.js pour protéger les routes
- Trigger automatique pour créer le profil à l'inscription

### Trigger SQL

```sql
-- Créer automatiquement un profil à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nom_complet, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'nom_complet', 'acheteur');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Middleware Next.js

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const protectedVendeur = req.nextUrl.pathname.startsWith('/vendeur')
  const protectedAcheteur = req.nextUrl.pathname.startsWith('/acheteur')
  const protectedAdmin = req.nextUrl.pathname.startsWith('/admin')

  if (!session && (protectedVendeur || protectedAcheteur || protectedAdmin)) {
    return NextResponse.redirect(new URL('/connexion', req.url))
  }

  return res
}

export const config = {
  matcher: ['/vendeur/:path*', '/acheteur/:path*', '/admin/:path*']
}
```

---

## 💳 Intégration Paiement — FedaPay

FedaPay est l'agrégateur de paiement adapté à l'Afrique de l'Ouest (supporte MTN MoMo, Moov Money, carte bancaire). Site : https://fedapay.com

### Installation

```bash
npm install fedapay
```

### Configuration

```typescript
// lib/fedapay.ts
import FedaPay, { Transaction } from 'fedapay'

FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY!)
FedaPay.setEnvironment(process.env.NODE_ENV === 'production' ? 'live' : 'sandbox')

export async function creerTransaction(params: {
  montant: number
  description: string
  acheteur: { nom: string; email: string; telephone?: string }
  commandeId: string
}) {
  const transaction = await Transaction.create({
    description: params.description,
    amount: params.montant,
    currency: { iso: 'XOF' },
    callback_url: `${process.env.NEXT_PUBLIC_URL}/api/webhooks/fedapay`,
    customer: {
      firstname: params.acheteur.nom.split(' ')[0],
      lastname: params.acheteur.nom.split(' ')[1] || '',
      email: params.acheteur.email,
      phone_number: {
        number: params.acheteur.telephone || '',
        country: 'BJ'
      }
    },
    metadata: { commande_id: params.commandeId }
  })

  const token = await transaction.generateToken()
  return { transactionId: transaction.id, urlPaiement: token.url }
}
```

### Webhook

```typescript
// app/api/webhooks/fedapay/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = createClient()

  if (body.name === 'transaction.approved') {
    const commandeId = body.entity.metadata?.commande_id
    await supabase
      .from('commandes')
      .update({
        statut_paiement: 'paye',
        statut: 'en_preparation',
        reference_paiement: body.entity.reference
      })
      .eq('id', commandeId)
  }

  return NextResponse.json({ received: true })
}
```

---

## 📦 Variables d'Environnement

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# FedaPay
FEDAPAY_SECRET_KEY=sk_live_xxxx          # sk_sandbox_xxxx pour les tests
NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY=pk_live_xxxx

# App
NEXT_PUBLIC_URL=https://beninmarket.vercel.app  # http://localhost:3000 en dev

# Email (Resend)
RESEND_API_KEY=re_xxxx
EMAIL_FROM=noreply@beninmarket.bj
```

---

## 📄 Pages & Fonctionnalités Détaillées

### 1. Homepage (`/`)

**Sections :**
- Hero banner avec barre de recherche
- Catégories populaires (grille d'icônes)
- Produits vedettes (carrousel)
- Boutiques recommandées
- Bannière téléchargement app (futur)
- Footer avec liens utiles

### 2. Catalogue Produits (`/produits`)

**Fonctionnalités :**
- Filtres : catégorie, ville, prix min/max, note minimale
- Tri : popularité, prix croissant/décroissant, nouveautés
- Pagination ou infinite scroll
- Vue grille / liste
- Recherche full-text

### 3. Détail Produit (`/produits/[slug]`)

**Sections :**
- Galerie d'images (zoom)
- Titre, prix, stock disponible
- Bouton Ajouter au panier / Acheter maintenant
- Infos vendeur + lien boutique
- Description complète
- Avis et notes
- Produits similaires

### 4. Page Boutique (`/boutiques/[slug]`)

**Sections :**
- Bannière + logo + infos boutique
- Statistiques (note, nombre de produits, ventes)
- Grille produits de la boutique
- Bouton contacter via WhatsApp

### 5. Panier (`/panier`)

**Fonctionnalités :**
- Liste des articles avec quantité modifiable
- Calcul automatique du total
- Frais de livraison estimés
- Bouton Passer la commande

### 6. Checkout (`/acheteur/checkout`)

**Étapes :**
1. Adresse de livraison (ville, quartier, instructions)
2. Choix méthode paiement (MTN MoMo / Moov Money / Carte)
3. Récapitulatif commande
4. Redirection vers FedaPay
5. Page confirmation après paiement

### 7. Dashboard Vendeur (`/vendeur/dashboard`)

**Widgets :**
- Total ventes du mois
- Nombre de commandes en attente
- Revenus nets (après commission)
- Graphique ventes par semaine
- Dernières commandes reçues

### 8. Gestion Produits Vendeur (`/vendeur/produits`)

**Fonctionnalités :**
- Liste produits avec statut et stock
- Créer / modifier / supprimer un produit
- Upload images (Supabase Storage)
- Activer/désactiver un produit

---

## 🎨 Design System

### Couleurs

```typescript
// tailwind.config.ts
colors: {
  primary: {
    50:  '#fdf3e7',
    100: '#fbe0be',
    500: '#E8821A',  // Orange béninois - couleur principale
    600: '#d4740f',
    700: '#b86200',
  },
  secondary: {
    500: '#2C7A4B',  // Vert - couleur secondaire
    600: '#245e39',
  },
  accent: '#FFD700',   // Or
}
```

### Typographie

- Police principale : **Inter** (Google Fonts)
- Tailles : 12px / 14px / 16px / 20px / 24px / 32px / 48px

### Composants UI Clés

```bash
# Installer shadcn/ui
npx shadcn-ui@latest init

# Composants à installer
npx shadcn-ui@latest add button card input label select
npx shadcn-ui@latest add dialog drawer badge skeleton
npx shadcn-ui@latest add toast tabs avatar separator
```

---

## 💰 Modèle de Monétisation

| Source | Détail | Taux |
|--------|--------|------|
| Commission ventes | Prélevée sur chaque vente | 5% |
| Abonnement vendeur Premium | Mise en avant + statistiques | 2 500 FCFA/mois |
| Produits sponsorisés | Apparition en haut du catalogue | 500 FCFA/semaine |
| Frais de livraison | Partenariat livreurs locaux | Variable |

---

## 🚀 Plan de Développement — Sprints

### Sprint 1 — Fondations (Semaine 1-2)
- [ ] Initialiser le projet Next.js + TypeScript + Tailwind
- [ ] Configurer Supabase (créer projet, exécuter migrations SQL)
- [ ] Configurer Vercel (lier repo GitHub)
- [ ] Implémenter l'authentification (inscription, connexion, déconnexion)
- [ ] Créer le layout principal (Header, Footer, nav mobile)
- [ ] Page d'accueil statique

### Sprint 2 — Catalogue & Boutiques (Semaine 3-4)
- [ ] Page catalogue produits avec filtres
- [ ] Page détail produit
- [ ] Page boutique vendeur
- [ ] Page catégories
- [ ] Barre de recherche fonctionnelle
- [ ] Upload images vers Supabase Storage

### Sprint 3 — Panier & Commandes (Semaine 5-6)
- [ ] Système de panier (Context API ou Zustand)
- [ ] Page panier
- [ ] Page checkout
- [ ] Intégration FedaPay
- [ ] Webhook paiement
- [ ] Emails de confirmation (Resend)

### Sprint 4 — Espace Vendeur (Semaine 7-8)
- [ ] Inscription vendeur + création boutique
- [ ] Dashboard vendeur
- [ ] CRUD produits
- [ ] Gestion commandes reçues
- [ ] Historique paiements / revenus

### Sprint 5 — Espace Acheteur & Admin (Semaine 9-10)
- [ ] Historique commandes acheteur
- [ ] Système d'avis / notes
- [ ] Favoris
- [ ] Notifications in-app
- [ ] Back-office admin (validation vendeurs, gestion catégories)

### Sprint 6 — Polish & Lancement (Semaine 11-12)
- [ ] Optimisation SEO (metadata, sitemap, OG tags)
- [ ] Performance (images Next.js, lazy loading)
- [ ] Tests et corrections de bugs
- [ ] Données de test (seed.sql)
- [ ] Mise en production sur Vercel

---

## ⚙️ Configuration Initiale — Commandes

```bash
# 1. Créer le projet
npx create-next-app@latest beninmarket \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias "@/*"

cd beninmarket

# 2. Installer les dépendances
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install @supabase/auth-helpers-react
npm install fedapay
npm install resend
npm install zod react-hook-form @hookform/resolvers
npm install zustand          # Gestion état panier
npm install lucide-react
npm install date-fns         # Formatage dates
npm install slugify          # Génération slugs

# 3. Initialiser shadcn/ui
npx shadcn-ui@latest init

# 4. Installer les composants shadcn
npx shadcn-ui@latest add button card input label select badge
npx shadcn-ui@latest add dialog drawer toast tabs avatar skeleton separator

# 5. Installer Supabase CLI (pour les migrations)
npm install -g supabase
supabase init
supabase link --project-ref TON_PROJECT_REF
```

---

## 📱 Considérations Locales Bénin

### Paiement
- FedaPay comme passerelle principale (MTN MoMo + Moov Money + Carte)
- Afficher les prix en **FCFA** (pas de virgule, format : `2 500 FCFA`)
- Prévoir paiement à la livraison comme option future

### Livraison
- Pas d'adresses précises → champs libres (quartier, repère, instructions)
- Partenaires livraison : Glovo Bénin, Zémidjan (moto-taxis), livraison vendeur
- Estimation délai : 1-3 jours à Cotonou, 3-7 jours en régions

### Interface
- **Mobile First** absolument (majorité des utilisateurs sur mobile)
- Taille de police lisible (min 16px sur mobile)
- Boutons larges (min 48px de hauteur)
- Mode hors-ligne partiel (mise en cache Service Worker — futur)
- WhatsApp comme canal de communication principal

### SEO Local
- Métadonnées en français
- URL en français (`/produits/chaussure-homme-cuir`)
- Balises Open Graph pour partage WhatsApp

---

## 🔧 Types TypeScript Principaux

```typescript
// types/index.ts

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
  whatsapp: string | null
  statut: 'en_attente' | 'active' | 'suspendue'
  note_moyenne: number
  created_at: string
}

export interface Produit {
  id: string
  boutique_id: string
  categorie_id: string | null
  nom: string
  slug: string
  description: string | null
  prix: number
  prix_promo: number | null
  stock: number
  images: string[]
  statut: 'actif' | 'inactif' | 'rupture'
  est_vedette: boolean
  note_moyenne: number
  total_avis: number
  boutique?: Boutique
  categorie?: Categorie
  created_at: string
}

export interface Categorie {
  id: string
  nom: string
  slug: string
  icone: string | null
  image_url: string | null
  parent_id: string | null
}

export interface Commande {
  id: string
  numero: string
  acheteur_id: string
  statut: 'en_attente' | 'payee' | 'en_preparation' | 'expediee' | 'livree' | 'annulee'
  adresse_livraison: string
  ville_livraison: string
  telephone_livraison: string
  methode_paiement: 'mtn_momo' | 'moov_money' | 'carte'
  statut_paiement: 'non_paye' | 'en_attente' | 'paye' | 'rembourse'
  sous_total: number
  frais_livraison: number
  total: number
  lignes?: LigneCommande[]
  created_at: string
}

export interface LigneCommande {
  id: string
  commande_id: string
  produit_id: string
  boutique_id: string
  nom_produit: string
  prix_unitaire: number
  quantite: number
  total: number
  image_url: string | null
}

export interface ItemPanier {
  produit: Produit
  quantite: number
}
```

---

## 🪝 Hook Panier (Zustand)

```typescript
// hooks/usePanier.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ItemPanier, Produit } from '@/types'

interface PanierState {
  items: ItemPanier[]
  ajouterItem: (produit: Produit, quantite?: number) => void
  retirerItem: (produitId: string) => void
  modifierQuantite: (produitId: string, quantite: number) => void
  viderPanier: () => void
  total: () => number
  nombreItems: () => number
}

export const usePanier = create<PanierState>()(
  persist(
    (set, get) => ({
      items: [],
      ajouterItem: (produit, quantite = 1) => {
        set((state) => {
          const existant = state.items.find(i => i.produit.id === produit.id)
          if (existant) {
            return {
              items: state.items.map(i =>
                i.produit.id === produit.id
                  ? { ...i, quantite: i.quantite + quantite }
                  : i
              )
            }
          }
          return { items: [...state.items, { produit, quantite }] }
        })
      },
      retirerItem: (produitId) => {
        set((state) => ({ items: state.items.filter(i => i.produit.id !== produitId) }))
      },
      modifierQuantite: (produitId, quantite) => {
        if (quantite <= 0) { get().retirerItem(produitId); return }
        set((state) => ({
          items: state.items.map(i =>
            i.produit.id === produitId ? { ...i, quantite } : i
          )
        }))
      },
      viderPanier: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + (i.produit.prix_promo ?? i.produit.prix) * i.quantite, 0),
      nombreItems: () => get().items.reduce((sum, i) => sum + i.quantite, 0),
    }),
    { name: 'panier-beninmarket' }
  )
)
```

---

## 🌍 Déploiement Vercel

```bash
# Connecter repo GitHub à Vercel
# → aller sur vercel.com → New Project → importer le repo

# Configurer les variables d'environnement sur Vercel Dashboard :
# Settings → Environment Variables → ajouter toutes les vars du .env.local

# Déploiement automatique à chaque push sur main
git push origin main
```

### vercel.json

```json
{
  "framework": "nextjs",
  "regions": ["cdg1"],
  "env": {
    "NEXT_PUBLIC_URL": "https://beninmarket.vercel.app"
  }
}
```

---

## 📋 Checklist Lancement

- [ ] Migrations SQL exécutées sur Supabase Cloud
- [ ] RLS activé et testé sur toutes les tables
- [ ] Variables d'environnement configurées sur Vercel
- [ ] FedaPay en mode live (clés production)
- [ ] Domaine personnalisé configuré (si disponible)
- [ ] 5+ boutiques test avec produits réels
- [ ] Test complet du tunnel achat (panier → paiement → confirmation)
- [ ] Test emails transactionnels (Resend)
- [ ] Lighthouse score > 80 (performance mobile)
- [ ] Pages 404 et erreur personnalisées

---

*Document généré pour Trae Solo — BéninMarket v1.0*
*Stack : Next.js 14 · Supabase · Vercel · FedaPay · TypeScript*
