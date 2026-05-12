'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, AlertCircle, ArrowLeft, ShieldCheck, Mail, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Identifiants invalides');
      }

      const data = await response.json();
      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('user-role', data.role);
      localStorage.setItem('user-name', data.userName);

      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
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
            <div className="relative w-14 h-14 rounded-2xl bg-abyss text-white inline-flex items-center justify-center shadow-ocean-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
          </div>
          <div>
            <p className="eyebrow !text-abyss-mid">Espace privé</p>
            <h1 className="text-3xl font-display font-bold tracking-tight mt-1">
              <span className="bg-gradient-to-r from-abyss via-primary to-aqua-500 bg-clip-text text-transparent">Admin PoolTrack</span>
            </h1>
            <p className="mt-1 text-sm text-text-secondary">Accès administrateur</p>
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
            <label htmlFor="email" className="block text-xs font-bold tracking-wider uppercase text-text-secondary mb-1.5">
              Email
            </label>
            <div className="input-wrap">
              <Mail className="input-icon w-5 h-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pooltrack.com"
                className="input-base"
                required
                disabled={loading}
                data-testid="admin-email"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold tracking-wider uppercase text-text-secondary mb-1.5">
              Mot de passe
            </label>
            <div className="input-wrap">
              <Lock className="input-icon w-5 h-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-base"
                required
                disabled={loading}
                data-testid="admin-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            data-testid="admin-submit"
            className="btn-primary w-full"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Connexion en cours…' : 'Se connecter'}
          </button>
        </form>

        {process.env.NODE_ENV !== 'production' && (
          <div className="pt-5 border-t border-white/60 text-center text-xs text-text-muted">
            Dev : <code className="font-mono px-2 py-0.5 rounded bg-aqua-50 text-aqua-700">admin@pooltrack.com / admin123</code>
          </div>
        )}
      </div>
    </main>
  );
}
