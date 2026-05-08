import Link from 'next/link';
import {
  Wrench,
  Lock,
  ArrowRight,
  Users,
  ShieldCheck,
  Sparkles,
  Settings,
  Tag,
  Droplets,
} from 'lucide-react';

interface PortalCardProps {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  items: string[];
  cta?: string;
  testId?: string;
}

function PortalCard({ icon, eyebrow, title, description, href, items, cta = 'Accéder', testId }: PortalCardProps) {
  return (
    <Link
      href={href}
      data-testid={testId}
      className="portal-card group flex flex-col gap-5"
    >
      {/* Icon medallion */}
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-2 rounded-full bg-gradient-lagoon opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
        />
        <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-ocean-soft text-white shadow-aqua-glow">
          {icon}
        </div>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="text-2xl font-display font-bold text-text tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bullet list */}
      <ul className="space-y-2.5 mt-auto">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2.5 text-sm text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-aqua-500" />
            {item}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div
        className="relative inline-flex items-center justify-center w-full mt-2 py-3 rounded-full text-white font-semibold
                   bg-gradient-ocean-soft shadow-ocean-md transition-all duration-300
                   group-hover:shadow-ocean-lg group-hover:translate-y-[-1px]"
      >
        <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-water-shine" />
        <span className="relative flex items-center gap-2">
          {cta}
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function MiniLink({
  href,
  title,
  description,
  cta,
  icon,
  accent = 'primary',
  testId,
}: {
  href: string;
  title: string;
  description: string;
  cta: string;
  icon: React.ReactNode;
  accent?: 'primary' | 'lagoon';
  testId?: string;
}) {
  const accentClasses =
    accent === 'lagoon'
      ? 'before:bg-gradient-lagoon'
      : 'before:bg-gradient-ocean-soft';
  return (
    <Link
      href={href}
      data-testid={testId}
      className={`relative isolate group block rounded-lg bg-white p-6 pl-8 shadow-ocean-sm border border-white/80
                  transition-all duration-300 hover:-translate-y-0.5 hover:shadow-ocean-md
                  before:absolute before:left-0 before:top-3 before:bottom-3 before:w-1.5 before:rounded-full ${accentClasses}`}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-aqua-50 text-aqua-700">
          {icon}
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-display font-bold text-text">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
          <span className="inline-flex items-center gap-1 mt-2 text-sm font-semibold transition-all duration-300 group-hover:gap-2">
            <span className="bg-gradient-ocean-soft bg-clip-text text-transparent">{cta}</span>
            <ArrowRight className="w-4 h-4 text-aqua-600" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-aqua-aurora">
      {/* Decorative water blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-32 w-[36rem] h-[36rem] rounded-full bg-aqua-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-48 -left-32 w-[34rem] h-[34rem] rounded-full bg-lagoon-light/40 blur-3xl"
      />

      {/* Subtle wave SVG at top edge */}
      <svg
        aria-hidden
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        className="pointer-events-none absolute top-0 left-0 w-full h-32 opacity-30"
      >
        <defs>
          <linearGradient id="wave" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#34C8F2" stopOpacity="0.0" />
            <stop offset="50%" stopColor="#34C8F2" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06B6A4" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path
          d="M0,80 C240,140 480,20 720,60 C960,100 1200,160 1440,80 L1440,0 L0,0 Z"
          fill="url(#wave)"
        />
      </svg>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-20 space-y-14">
        {/* ─────────── HERO ─────────── */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-white/70 shadow-ocean-sm">
            <Sparkles className="w-4 h-4 text-aqua-600" />
            <span className="text-xs font-bold tracking-[0.14em] uppercase text-aqua-700">
              La preuve de chaque passage
            </span>
          </div>

          <div className="flex justify-center">
            <div className="relative inline-flex items-center justify-center">
              <div
                aria-hidden
                className="absolute -inset-6 rounded-full bg-gradient-lagoon opacity-25 blur-2xl"
              />
              <div className="relative flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-ocean text-white shadow-ocean-lg">
                <Droplets className="w-8 h-8" />
              </div>
            </div>
          </div>

          <h1 className="display-1">
            <span className="bg-gradient-to-r from-abyss via-primary to-aqua-500 bg-clip-text text-transparent">
              PoolTrack
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-text-secondary font-body leading-relaxed">
            Gestion d&apos;entretien de piscine.
            <span className="text-text"> Choisissez votre espace.</span>
          </p>
        </section>

        {/* ─────────── PORTAL GRID ─────────── */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PortalCard
            icon={<Users className="w-7 h-7" />}
            eyebrow="Pisciniste"
            title="Entreprise"
            description="Pilotez votre activité, vos techniciens et vos clients."
            href="/login"
            items={[
              'Gérer vos piscines',
              'Gérer vos techniciens',
              'Gérer vos clients',
              'Statistiques en temps réel',
            ]}
            testId="portal-entreprise"
          />

          <PortalCard
            icon={<Wrench className="w-7 h-7" />}
            eyebrow="Sur le terrain"
            title="Espace Technicien"
            description="Documentez chaque passage en quelques secondes."
            href="/technicien/acces"
            items={[
              'Voir le planning',
              'Enregistrer interventions',
              'Photos et mesures',
              'Générer rapports',
            ]}
            testId="portal-technicien"
          />

          <PortalCard
            icon={<Lock className="w-7 h-7" />}
            eyebrow="Propriétaire"
            title="Portail Client"
            description="Suivez l&apos;état de votre piscine depuis votre canapé."
            href="/portail"
            items={[
              'État de votre piscine',
              'Historique des passages',
              'Galerie photos',
              'Signer vos devis',
            ]}
            testId="portal-proprietaire"
          />
        </section>

        {/* ─────────── QUICK LINKS ─────────── */}
        <section className="grid md:grid-cols-2 gap-5">
          <MiniLink
            href="/tarifs"
            title="Nos tarifs"
            description="Plans Standard, Pro et Marque Blanche — essai 14 jours offert."
            cta="Voir les plans"
            icon={<Tag className="w-5 h-5" />}
            accent="lagoon"
            testId="link-tarifs"
          />
          <MiniLink
            href="/parametres"
            title="Paramètres"
            description="Notifications, profil et préférences utilisateur."
            cta="Accéder"
            icon={<Settings className="w-5 h-5" />}
            accent="primary"
            testId="link-parametres"
          />
        </section>

        {/* ─────────── REASSURANCE STRIP ─────────── */}
        <section className="card-glass !p-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-lagoon" />
            Données hébergées en Europe
          </span>
          <span className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-aqua-500" />
            Essai 14 jours sans CB
          </span>
          <span className="inline-flex items-center gap-2">
            <Droplets className="w-4 h-4 text-primary" />
            Spécialisé piscines pro
          </span>
        </section>

        {/* ─────────── FOOTER ─────────── */}
        <footer className="text-center pt-6 space-y-3 border-t border-white/60">
          <p className="text-sm text-text-secondary">
            Bienvenue sur <span className="font-bold text-text">PoolTrack</span> — la plateforme SaaS pour les professionnels de la piscine.
          </p>
          <p className="text-xs text-text-muted">
            <Link
              href="/admin"
              data-testid="link-admin"
              className="hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Espace administrateur
            </Link>
            <span className="mx-2 text-text-muted/50">·</span>
            © {new Date().getFullYear()} PoolTrack
          </p>
        </footer>
      </div>
    </main>
  );
}
