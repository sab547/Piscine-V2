import Link from 'next/link';
import { Wrench, Lock, BarChart3, ArrowRight, Droplets, Star, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F0F6FF] via-white to-[#F0F6FF]">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-ocean-sm">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary font-display">PoolTrack</span>
        </div>
        <Link
          href="/admin/login"
          className="text-sm font-semibold text-text-muted hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <Shield className="w-4 h-4" />
          Admin
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 pt-8 pb-16 space-y-16">
        {/* Hero */}
        <div className="text-center space-y-5 pt-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-4 py-2 rounded-full">
            <Star className="w-3.5 h-3.5" />
            La référence SaaS pour les pros de la piscine
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-text font-display leading-tight tracking-tight">
            Gérez vos interventions<br />
            <span className="text-primary">avec précision</span>
          </h1>
          <p className="text-lg text-text-muted max-w-xl mx-auto font-body leading-relaxed">
            PoolTrack centralise vos rapports, vos clients et vos techniciens dans une plateforme ultra-fluide.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          <PortalCard
            icon={<Wrench className="w-6 h-6 text-primary" />}
            iconBg="bg-primary/10"
            title="Espace Technicien"
            description="Gérez vos interventions et passages terrain"
            href="/dashboard"
            accent="border-primary"
            btnClass="bg-primary hover:bg-primary-dark text-white"
            items={['Planning du jour', 'Rapport en 5 étapes', 'Photos avant / après', 'Mesures qualité eau']}
          />

          <PortalCard
            icon={<Lock className="w-6 h-6 text-accent" />}
            iconBg="bg-accent/10"
            title="Portail Propriétaire"
            description="Suivi en temps réel de votre piscine"
            href="/portail/token_001"
            accent="border-accent"
            btnClass="bg-accent hover:bg-accent/90 text-white"
            items={['État de la piscine', 'Historique des passages', 'Galerie photos', 'Devis & factures']}
          />

          <PortalCard
            icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
            iconBg="bg-purple-100"
            title="Tableau de bord Admin"
            description="Vue d'ensemble de votre activité"
            href="/admin/login"
            accent="border-purple-400"
            btnClass="bg-purple-600 hover:bg-purple-700 text-white"
            items={['KPIs temps réel', 'Gestion clients', 'Suivi techniciens', 'Toutes les interventions']}
          />
        </div>

        {/* Stats bar */}
        <div className="bg-white border border-border/60 rounded-2xl px-6 py-5 shadow-[0_1px_4px_rgba(11,94,168,0.06)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '150+', label: 'Piscines gérées' },
              { value: '98%', label: 'Satisfaction client' },
              { value: '4 min', label: 'Rapport moyen' },
              { value: '0', label: 'Papier utilisé' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-primary font-mono">{s.value}</p>
                <p className="text-sm text-text-muted mt-1 font-body">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-text-muted space-y-2">
          <div className="flex items-center justify-center gap-6">
            <Link href="/tarifs" className="hover:text-primary transition-colors">Tarifs</Link>
            <span>·</span>
            <button className="hover:text-primary transition-colors">Conditions</button>
            <span>·</span>
            <button className="hover:text-primary transition-colors">Confidentialité</button>
          </div>
          <p>© 2026 PoolTrack. Tous droits réservés.</p>
        </div>
      </div>
    </main>
  );
}

function PortalCard({
  icon, iconBg, title, description, href, accent, btnClass, items,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  href: string;
  accent: string;
  btnClass: string;
  items: string[];
}) {
  return (
    <div className={`bg-white border-t-4 ${accent} rounded-2xl p-6 shadow-[0_2px_12px_rgba(11,94,168,0.07)] space-y-5 flex flex-col`}>
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-text font-display text-base">{title}</h2>
          <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>

      <ul className="space-y-2 flex-1">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-xl transition-all active:scale-95 text-sm ${btnClass}`}
      >
        Accéder
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
