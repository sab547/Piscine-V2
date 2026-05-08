'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Droplets, LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur de connexion');
      }

      const data = await response.json();
      localStorage.setItem('auth-token', data.token);
      localStorage.setItem('user-role', data.role);
      localStorage.setItem('tenant-id', data.tenantId);

      if (data.role === 'pisciniste') {
        router.push('/entreprise');
      } else {
        router.push('/technicien/piscines');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-aqua-aurora flex items-center justify-center px-4 py-12">
      {/* Decorative blobs */}
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
        {/* Brand mark */}
        <div className="text-center space-y-4">
          <div className="relative inline-flex items-center justify-center">
            <div aria-hidden className="absolute -inset-3 rounded-full bg-gradient-lagoon opacity-25 blur-xl" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-ocean text-white inline-flex items-center justify-center shadow-ocean-lg">
              <Droplets className="w-7 h-7" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              <span className="bg-gradient-to-r from-abyss via-primary to-aqua-500 bg-clip-text text-transparent">PoolTrack</span>
            </h1>
            <p className="mt-1 text-sm text-text-secondary">Connexion Pisciniste · Technicien</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3.5 rounded-md bg-danger-light text-danger text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="vous@email.com"
                className="input-base"
                required
                disabled={loading}
                data-testid="login-email"
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
                data-testid="login-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="login-submit"
            className="btn-primary w-full"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Connexion en cours…' : 'Se connecter'}
          </button>
        </form>

        {/* Secondary actions */}
        <div className="pt-5 border-t border-white/60 space-y-2 text-center">
          <p className="text-sm text-text-secondary">
            Administrateur ?{' '}
            <Link href="/admin" className="font-semibold text-primary hover:text-aqua-600 transition-colors">
              Accès Admin
            </Link>
          </p>
          <p className="text-sm text-text-secondary">
            Vous êtes client ?{' '}
            <Link href="/portail" className="font-semibold text-primary hover:text-aqua-600 transition-colors">
              Accès portail propriétaire
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
