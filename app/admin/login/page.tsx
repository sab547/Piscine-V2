'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Droplets, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';

const ADMIN_EMAIL = 'admin@pooltrack.fr';
const ADMIN_PASSWORD = 'PoolTrack2024!';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_auth', 'true');
        router.push('/admin');
      } else {
        setError('Identifiants incorrects. Vérifiez votre email et mot de passe.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F6FF] via-white to-[#F0F6FF] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-ocean-md">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-text font-display">PoolTrack</h1>
            <p className="text-sm text-text-muted">Espace Administrateur</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-ocean-sm space-y-5">
          <div className="flex items-center gap-2 text-sm text-text-muted pb-3 border-b border-border/50">
            <Shield className="w-4 h-4 text-primary" />
            <span>Accès sécurisé — identifiants uniques</span>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-danger/5 border border-danger/20 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
              <p className="text-xs text-danger">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1.5">
                Adresse email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pooltrack.fr"
                className="input-base"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="input-base pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion…
                </span>
              ) : 'Se connecter'}
            </button>
          </form>

          <p className="text-xs text-text-muted text-center">
            Accès réservé aux administrateurs autorisés
          </p>
        </div>

        {/* Back link */}
        <div className="text-center">
          <a href="/" className="text-xs text-text-muted hover:text-primary transition-colors">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
