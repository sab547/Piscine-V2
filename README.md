# 🏊 PoolTrack

PoolTrack transforme chaque passage technicien en preuve d'intervention horodatée, photographiée et envoyée automatiquement au propriétaire.

## 📋 Setup en 5 étapes

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration des variables d'environnement

```bash
cp .env.example .env.local
```

Remplissez les variables :
- `DATABASE_URL` : URL PostgreSQL (Supabase)
- `NEXT_PUBLIC_SUPABASE_URL` : URL Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Anon key
- `SUPABASE_SERVICE_ROLE_KEY` : Service role key
- `RESEND_API_KEY` : API key Resend (email)
- `STRIPE_SECRET_KEY` : Secret key Stripe
- `STRIPE_WEBHOOK_SECRET` : Webhook secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` : Publishable key

### 3. Setup de la base de données

```bash
npx prisma migrate dev --name init
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Visitez [http://localhost:3000](http://localhost:3000)

### 5. (Optionnel) Prisma Studio

Pour explorer/modifier les données :

```bash
npm run db:studio
```

## 📦 Stack technique

- **Framework** : Next.js 14 + TypeScript
- **Styling** : Tailwind CSS 3.x
- **BDD** : Supabase (PostgreSQL)
- **ORM** : Prisma 5.x
- **Email** : Resend
- **PDF** : @react-pdf/renderer
- **Paiement** : Stripe
- **Hébergement** : Vercel

## 🎨 Design System

### Couleurs principales

```css
--color-primary:      #0B5EA8;  /* Bleu océan */
--color-primary-dark: #083F74;  /* Bleu foncé */
--color-accent:       #00B4D8;  /* Cyan */
--color-success:      #10B981;  /* Vert */
--color-warning:      #F59E0B;  /* Orange */
--color-danger:       #EF4444;  /* Rouge */
```

### Typographies

- **Sora** : Titres (400, 600, 700)
- **DM Sans** : Corps de texte (400, 500)
- **JetBrains Mono** : Valeurs numériques (400)

## 📝 Structure des fichiers

```
pooltrack/
├── app/                 # Next.js App Router
├── components/          # Composants React
│   ├── ui/             # Composants de base
│   ├── passage/        # Flow passage
│   ├── piscine/        # Gestion piscines
│   ├── portail/        # Portail propriétaire
│   └── layout/         # Layout global
├── lib/                # Utilitaires
│   ├── supabase/       # Clients Supabase
│   ├── pdf/            # Génération PDF
│   ├── email/          # Envoi emails
│   └── stripe/         # Intégration Stripe
├── prisma/             # Schéma BDD
├── types/              # Types TypeScript
└── public/             # Fichiers statiques
```

## 🚀 Prochaines étapes

1. **Tâche 2** : Flow passage en 5 étapes
2. **Tâche 3** : Dashboard technicien
3. **Tâche 4** : Portail propriétaire
4. **Tâche 5** : Page tarifs + Stripe

## 📞 Support

Pour des questions ou des issues, consultez la documentation PoolTrack ou contactez l'équipe.
