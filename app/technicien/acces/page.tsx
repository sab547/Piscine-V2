'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, KeyRound, Wrench, AlertCircle } from 'lucide-react';

export default function TechnicienAccessPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/validate-tech-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Code invalide');
      }

      localStorage.setItem('tech-access-token', code);
      router.push('/technicien/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de validation');
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
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-lagoon text-white inline-flex items-center justify-center shadow-ocean-lg">
              <Wrench className="w-7 h-7" />
            </div>
          </div>
          <div>
            <p className="eyebrow">Sur le terrain</p>
            <h1 className="text-3xl font-display font-bold tracking-tight mt-1">
              <span className="bg-gradient-to-r from-abyss via-primary to-aqua-500 bg-clip-text text-transparent">Accès Technicien</span>
            </h1>
            <p className="mt-1 text-sm text-text-secondary">Saisissez votre code à 6 caractères</p>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3.5 rounded-md bg-danger-light text-danger text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-xs font-bold tracking-wider uppercase text-text-secondary mb-1.5">
              Code d&apos;accès
            </label>
            <div className="input-wrap">
              <KeyRound className="input-icon w-5 h-5" />
              <input
                id="code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="••••••"
                className="input-base text-center tracking-[0.6em] font-mono text-lg"
                required
                disabled={loading}
                maxLength={6}
                data-testid="tech-code"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            data-testid="tech-submit"
            className="btn-aqua w-full"
          >
            {loading ? 'Validation…' : 'Valider le code'}
          </button>
        </form>

        <div className="pt-5 border-t border-white/60 text-center space-y-2">
          <p className="text-sm text-text-secondary">Pas encore inscrit ?</p>
          <p className="text-xs text-text-muted">
            Contactez votre pisciniste pour obtenir un code d&apos;accès.
          </p>
        </div>
      </div>
    </main>
  );
}
