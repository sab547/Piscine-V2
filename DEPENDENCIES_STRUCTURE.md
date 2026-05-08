# 📊 STRUCTURE D'INDENTATION ET DÉPENDANCES - POOLTRACK

## ✅ État Global du Projet

### Indentation
- **Status**: ✅ Conforme (2 espaces)
- **Tabulations trouvées**: Aucune
- **Indentation mixte**: Aucune

### Linting
- **Warnings**: 8 (images non optimisées - mineur)
- **Errors**: Aucune

### Dépendances NPM
- **Montées à jour**: Oui
- **Vulnérabilités**: À vérifier
- **Dépendances manquantes**: À identifier

---

## 🔗 ARBRE DES DÉPENDANCES (Core Features)

### 1. **Core Feature: Passage Flow (le cœur produit)**
```
PassageFlow (parent)
├── Step0Welcome
├── Step1PhotoBefore
│   └── PhotoUpload
├── Step2PhotoAfter
│   └── PhotoUpload
│   └── Comparaison images
├── Step3Measurements
│   └── Input validation
├── Step4Preview
│   └── Email simulation
├── Step5Confirmation
│   └── Animation
└── ProgressBar
```

**Imports requis**:
```
✅ React hooks (useState)
✅ date-fns (timestamps)
✅ Tailwind CSS
⚠️ API: POST /api/passage/complete (Non implémenté)
⚠️ PDF generation (Non implémenté)
⚠️ Email sending (Non implémenté)
```

---

### 2. **Core Feature: Web Hooks**
```
API Routes (Next.js Route Handlers)
├── /api/passage/complete
│   ├── [WEBHOOK] POST → Passage statut COMPLETE
│   ├── → PDF generation (generateRapportPDF)
│   ├── → Email sending (sendRapportEmail)
│   ├── → Database update (Prisma)
│   └── → Portal update
├── /api/stripe/webhook
│   ├── [WEBHOOK] POST → Stripe events
│   ├── Customer.created
│   ├── Invoice.paid
│   └── Subscription.deleted
├── /api/anomalie/create
├── /api/devis/create
└── /api/auth/callback
```

**Imports requis**:
```
✅ Next.js route handlers
✅ Prisma client
✅ Zod validation
⚠️ Resend (email)
⚠️ @react-pdf/renderer
⚠️ Stripe SDK
⚠️ Supabase auth
```

---

### 3. **Core Feature: Skills (Compétences utilisateur)**
```
User Roles & Permissions
├── TECHNICIEN
│   ├── Can create passage
│   ├── Can upload photos
│   ├── Can enter measurements
│   ├── Can send reports
│   └── Cannot access admin
├── GERANT
│   ├── Can manage technicians
│   ├── Can view all passages
│   ├── Can create quotes
│   ├── Can manage clients
│   └── Can access billing
└── [FUTURE] ADMIN_SYSTEM
    ├── Can manage tenants
    ├── Can manage plans
    └── Can view analytics
```

**Middleware requis**:
```
⚠️ Auth middleware (role check)
⚠️ Tenant isolation middleware
⚠️ RLS Supabase policies
```

---

## 🔴 PROBLÈMES IDENTIFIÉS

### Critiques
1. **Middleware d'authentification manquant**
   - `app/middleware.ts` non existe pas
   - `tenantId` injection non implémentée
   - Risque: Fuite de données multi-tenant

2. **API Webhooks non implémentés**
   - `/api/passage/complete` → TODOs
   - `/api/stripe/webhook` → TODOs
   - PDF generation → Non implémenté
   - Email sending → Non implémenté

3. **Prisma schema non synchronisé**
   - `prisma/schema.prisma` manquant
   - Migrations non initialisées

### Majeurs
4. **Imports d'images <img> au lieu de <Image />**
   - 5 fichiers concernés
   - Impact: Performance LCP, SEO

5. **Variables d'environnement**
   - `.env.example` incomplet
   - `.env.local` non créé

### Mineurs
6. **Types API Response wrapper non utilisé**
   - `ApiResponse<T>` défini mais inutilisé
   - Inconsistance: certains endpoints le retournent, d'autres non

7. **Composants UI manquants**
   - Badge, Card, Modal basiques non extraits
   - Code dupliqué

---

## 🧹 PLAN DE NETTOYAGE

### Phase 1: Configuration (30 min)
- [ ] Créer `prisma/schema.prisma` (copier du prompt)
- [ ] Créer `.env.local` depuis `.env.example`
- [ ] Initialiser Prisma: `npx prisma generate`
- [ ] Créer `app/middleware.ts` (auth + tenantId)

### Phase 2: Corrections rapides (20 min)
- [ ] Remplacer `<img>` par `<Image />` (5 fichiers)
- [ ] Créer composants UI réutilisables (Button, Badge, Card)
- [ ] Harmoniser réponses API avec `ApiResponse<T>`

### Phase 3: Webhooks & Services (45 min)
- [ ] Implémenter `/api/v1/passage/complete`
- [ ] Implémenter `/api/v1/stripe/webhook`
- [ ] Implémenter `lib/pdf/generateRapport.ts`
- [ ] Implémenter `lib/email/sendRapport.ts`

### Phase 4: Sécurité (30 min)
- [ ] RLS Supabase policies
- [ ] Validation Zod sur tous les endpoints
- [ ] Tests de multi-tenancy isolation

---

## 📁 STRUCTURE RECOMMANDÉE POST-CLEANUP

```
pooltrack/
├── app/
│   ├── middleware.ts              ← NEW: Auth + tenantId
│   ├── api/v1/                    ← NEW: Versioned APIs
│   │   ├── passage/complete/route.ts
│   │   ├── stripe/webhook/route.ts
│   │   ├── anomalie/create/route.ts
│   │   └── devis/create/route.ts
│   ├── (auth)/
│   ├── (dashboard)/
│   ├── portail/
│   ├── tarifs/
│   └── admin/
├── components/
│   ├── ui/                        ← NEW: Reusable atoms
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── passage/
│   ├── layout/
│   └── piscine/
├── lib/
│   ├── api/                       ← NEW: API helpers
│   │   ├── validation.ts
│   │   └── response.ts
│   ├── hooks/                     ← NEW: React hooks
│   │   ├── useAuth.ts
│   │   └── useTenant.ts
│   ├── pdf/
│   ├── email/
│   ├── stripe/
│   └── supabase/
├── prisma/
│   ├── schema.prisma              ← NEW: Generate from prompt
│   └── migrations/                ← NEW: Initialize
├── types/
│   └── index.ts                   ✅ Bon
└── .env.example                   ← À compléter
```

---

## 🚀 PROCHAINES ÉTAPES

1. **Immédiate** (5 min): Créer `.env.local` stub
2. **Immédiate** (10 min): Copier Prisma schema du prompt
3. **Immédiate** (15 min): Créer `app/middleware.ts` de base
4. **Immédiate** (15 min): Remplacer images `<img>`
5. **Tâche**: Implémenter webhooks critiques

---

**Généré**: 2026-05-08
**Status**: Prêt pour développement
