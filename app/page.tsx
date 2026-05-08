import Link from 'next/link';
import { Wrench, Lock, BarChart3, ArrowRight, Users, Shield } from 'lucide-react';

interface PortalCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: 'primary' | 'accent' | 'admin';
  items: string[];
}

function PortalCard({ icon, title, description, href, color, items }: PortalCardProps) {
  const colorMap = {
    primary: 'border-primary bg-primary/5',
    accent: 'border-accent bg-accent/5',
    admin: 'border-purple-500 bg-purple-500/5',
  };

  const colorText = {
    primary: 'text-primary',
    accent: 'text-accent',
    admin: 'text-purple-600',
  };

  const buttonColor = {
    primary: 'btn-primary',
    accent: 'bg-accent hover:bg-accent/90 text-white',
    admin: 'bg-purple-600 hover:bg-purple-700 text-white',
  };

  return (
    <div
      className={`card border-l-4 ${colorMap[color]} space-y-4 hover:shadow-lg transition-all`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-3 rounded-lg bg-white border border-border`}>{icon}</div>
        <div className="flex-1">
          <h2 className={`text-xl font-bold font-display ${colorText[color]}`}>{title}</h2>
          <p className="text-sm text-text-muted">{description}</p>
        </div>
      </div>

      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            {item}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg transition-colors ${
          color === 'primary'
            ? buttonColor.primary
            : color === 'accent'
              ? buttonColor.accent
              : buttonColor.admin
        }`}
      >
        Accéder
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-primary font-display">PoolTrack</h1>
          <p className="text-xl text-text-muted font-body">
            Gestion d&apos;entretien de piscine - Choisissez votre espace
          </p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <PortalCard
            icon={<Users className="w-8 h-8 text-blue-600" />}
            title="Entreprise/Pisciniste"
            description="Gestion de votre activité"
            href="/login"
            color="primary"
            items={[
              'Gérer vos piscines',
              'Gérer vos techniciens',
              'Gérer vos clients',
              'Statistiques',
            ]}
          />

          <PortalCard
            icon={<Wrench className="w-8 h-8 text-green-600" />}
            title="Espace Technicien"
            description="Gestion des interventions"
            href="/technicien/acces"
            color="primary"
            items={[
              'Voir le planning',
              'Enregistrer interventions',
              'Photos et mesures',
              'Générer rapports',
            ]}
          />

          <PortalCard
            icon={<Lock className="w-8 h-8 text-purple-600" />}
            title="Portail Propriétaire"
            description="Suivi de votre piscine"
            href="/portail"
            color="accent"
            items={[
              'État de votre piscine',
              'Historique passages',
              'Galerie photos',
              'Signer devis',
            ]}
          />
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/tarifs"
            className="card border-l-4 border-warning hover:shadow-lg transition-all group"
          >
            <h3 className="font-bold text-text font-display mb-2">Nos tarifs</h3>
            <p className="text-sm text-text-muted mb-3">
              Découvrez nos plans et tarification
            </p>
            <span className="inline-flex items-center gap-1 text-warning font-semibold group-hover:gap-2 transition-all">
              Voir les plans <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/parametres"
            className="card border-l-4 border-primary hover:shadow-lg transition-all group"
          >
            <h3 className="font-bold text-text font-display mb-2">Paramètres</h3>
            <p className="text-sm text-text-muted mb-3">Gérez vos préférences utilisateur</p>
            <span className="inline-flex items-center gap-1 text-primary font-semibold group-hover:gap-2 transition-all">
              Accéder <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-text-muted border-t border-border pt-6 space-y-3">
          <p>Bienvenue sur <span className="font-bold text-text">PoolTrack</span> - La plateforme SaaS pour professionnels de la piscine</p>
          <p className="text-xs">
            <Link href="/admin" className="hover:text-text transition opacity-50 hover:opacity-100">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
