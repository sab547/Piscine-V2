import Link from 'next/link';
import { Droplets, Lock, Users, Settings, CreditCard } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary to-primary-dark px-4 py-12">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-white font-display">
            PoolTrack
          </h1>
          <p className="text-lg text-white/80 font-body">
            Gestion d&apos;entretien de piscine
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-6 space-y-4">
          <h2 className="text-white font-semibold text-center">
            Sélectionner votre espace
          </h2>

          <Link
            href="/passage/m1"
            className="flex items-center gap-3 bg-white hover:bg-white/90 text-primary font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Droplets className="w-5 h-5" />
            Intervention (Technicien)
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 bg-primary-dark hover:bg-primary text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Users className="w-5 h-5" />
            Dashboard
          </Link>

          <Link
            href="/portail/token_001"
            className="flex items-center gap-3 bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Lock className="w-5 h-5" />
            Portail Propriétaire
          </Link>

          <Link
            href="/parametres"
            className="flex items-center gap-3 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            Paramètres
          </Link>

          <Link
            href="/tarifs"
            className="flex items-center gap-3 bg-success hover:bg-success/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            Tarifs & Plans
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 text-center space-y-2">
          <p className="text-sm text-white/80 font-body">
            Vous pouvez accéder à toutes les pages de l&apos;application depuis ce menu.
          </p>
        </div>
      </div>
    </main>
  );
}
