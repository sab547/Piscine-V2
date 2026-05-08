'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function PortailAccessPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/magic-link-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Email non reconnu');
      }

      setSuccess('Lien magique envoyé ! Consultez votre boîte mail pour accéder à votre espace.');
      setEmail('');

      setTimeout(() => {
        router.push('/portail/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la demande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-aqua-aurora flex items-center justify-center px-4 py-12">
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 w-[36rem] h-[36rem] rounded-full bg-aqua-200/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 w-[32rem] h-[32rem] rounded-full bg-lagoon-light/40 blur-3xl" />

      <Link
        href="/"
        data-testid="back-home"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Accueil
      </Link>

      <div className="relative w-full max-w-md card-glass !p-8 space-y-7">
        <div className="text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div aria-hidden className="absolute -inset-3 rounded-full bg-gradient-lagoon opacity-25 blur-xl" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-ocean text-white inline-flex items-center justify-center shadow-ocean-lg">
              <Lock className="w-7 h-7" />
            </div>
          </div>

          <div>
            <p className="eyebrow">Propriétaire</p>
            <h1 className="text-3xl font-display font-bold tracking-tight mt-1">
              <span className="bg-gradient-to-r from-abyss via-primary to-aqua-500 bg-clip-text text-transparent">Portail Client</span>
            </h1>
            <p className="mt-1 text-sm text-text-secondary">Accédez à votre espace en un clic</p>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3.5 rounded-md bg-danger-light text-danger text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2 p-3.5 rounded-md bg-success-light text-success text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold tracking-wider uppercase text-text-secondary mb-1.5">
              Adresse email
            </label>
            <div className="input-wrap">
              <Mail className="input-icon w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@email.com"
                className="input-base"
                required
                disabled={loading}
                data-testid="portail-email"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            data-testid="portail-submit"
            className="btn-aqua w-full"
          >
            <Mail className="w-4 h-4" />
            {loading ? 'Envoi en cours…' : 'Envoyer le lien de connexion'}
          </button>
        </form>

        <div className="pt-5 border-t border-white/60 space-y-3 text-center">
          <p className="text-sm text-text-secondary">
            Vous recevrez un lien de connexion sécurisé par email.
          </p>
          <div className="text-xs">
            <p className="text-text-muted mb-1">Démo :</p>
            <code className="font-mono text-xs px-2 py-1 rounded bg-aqua-50 text-aqua-700">
              proprietaire@example.com
            </code>
          </div>
        </div>
      </div>
    </main>
  );
}
