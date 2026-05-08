# 🚀 NEXT STEPS - Pour démarrer le développement

## Avant de faire `npm run dev`

### 1️⃣ Configuration d'environnement (5 min)
```bash
# Créer le fichier .env.local depuis le template
cp .env.local.example .env.local

# Remplir les variables:
# - DATABASE_URL (Supabase)
# - NEXT_PUBLIC_SUPABASE_* (Supabase API keys)
# - RESEND_API_KEY (Email service)
# - STRIPE_* (Payment)
# - JWT_SECRET (random secret)
```

### 2️⃣ Initialiser Prisma (2 min)
```bash
# Générer le client Prisma
npx prisma generate

# (Optionnel si BD initialisée) Migrer le schema
npx prisma migrate dev --name init
```

### 3️⃣ Démarrer le serveur (1 min)
```bash
npm run dev
```

Visit: http://localhost:3000

---

## Fichiers prêts pour le développement

### UI Components (réutilisables)
```typescript
// Import depuis components/ui/
import { Button, Badge, Card, CardTitle, CardContent, OptimizedImage } from '@/components/ui';

// Exemples:
<Button variant="primary" fullWidth>Valider</Button>
<Badge variant="success">pH optimal</Badge>
<Card>
  <CardTitle>Mon titre</CardTitle>
  <CardContent>Mon contenu</CardContent>
</Card>
<OptimizedImage src={src} alt="pool" width={200} height={200} />
```

### API Response Patterns
```typescript
// Dans app/api/...
import { successResponse, errorResponse } from '@/lib/api/response';
import { passageCompleteSchema } from '@/lib/api/validation';

export async function POST(request: Request) {
  const body = await request.json();
  
  // Valider avec Zod
  const parsed = passageCompleteSchema.parse(body);
  
  // Répondre correctement
  return successResponse({ passageId: parsed.passageId }, 201);
}
```

### Types disponibles
```typescript
import { ApiResponse, Tenant, User, Passage, etc } from '@/types';

// Toutes les interfaces TypeScript du projet
```

---

## Prochaines Tâches (pour le core product)

### [CRITICAL] Webhooks
- [ ] POST `/api/v1/passage/complete` → PDF + Email
- [ ] POST `/api/v1/stripe/webhook` → Gestion des paiements

### [CRITICAL] Services
- [ ] `lib/pdf/generateRapport.ts` → Générer PDF
- [ ] `lib/email/sendRapport.ts` → Envoyer email

### [HIGH] Auth
- [ ] Magic link login (Supabase Auth)
- [ ] Session management
- [ ] Role-based access control (RBAC)

### [HIGH] Multi-tenancy
- [ ] Middleware: vérifier JWT et injecter tenantId
- [ ] Row-level security (Supabase RLS)
- [ ] Test d'isolation données

---

## Architecture décisions prises

✅ **Middleware**: Next.js middleware.ts (auth + tenantId)
✅ **API**: Route handlers avec Zod validation
✅ **UI**: Composants réutilisables centralisés
✅ **Styling**: Tailwind CSS avec tokens du design system
✅ **Database**: Prisma ORM + Supabase PostgreSQL
✅ **Auth**: Supabase Auth helpers
✅ **Email**: Resend (simple, fiable)
✅ **PDF**: @react-pdf/renderer
✅ **Payment**: Stripe Billing

---

## Checklist de qualité avant commit

```bash
# Vérifier le linting
npm run lint

# Vérifier TypeScript
npx tsc --noEmit

# Vérifier Prisma
npx prisma validate

# Formatter le code
npx prettier --write .
```

---

**Status**: ✅ Code prêt, structure nettoyée, dépendances OK

Vous pouvez maintenant développer le core product en confiance! 🎯
