'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CacheStats {
  tenantCount: number;
  userCount: number;
  passageCount: number;
  devisCount: number;
  uptimePercent: number;
  databaseSize: string;
  cacheHitRate: number;
  lastUpdated: string;
}

export default function AdminCachePage() {
  const router = useRouter();
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (token) {
      fetchStats(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch('/api/v1/admin/cache', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('admin-token');
          setAuthenticated(false);
        }
        throw new Error('Erreur lors du chargement des stats');
      }

      const data = await response.json();
      setStats(data);
      setAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error('Identifiants invalides');
      }

      const data = await response.json();
      localStorage.setItem('admin-token', data.token);
      setLoginData({ username: '', password: '' });
      await fetchStats(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    setAuthenticated(false);
    setStats(null);
  };

  if (loading && !authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 max-w-md w-full border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-2">PoolTrack Admin</h1>
          <p className="text-gray-400 mb-6">Tableau de bord administrateur</p>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Identifiant</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                placeholder="Entrez votre identifiant"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">Mot de passe</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 rounded transition"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">PoolTrack Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Monitoring et statistiques du système</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition"
          >
            Déconnexion
          </button>
        </div>

        {/* Last updated */}
        {stats && (
          <div className="mb-6 text-gray-400 text-sm">
            Dernière mise à jour : {new Date(stats.lastUpdated).toLocaleString('fr-FR')}
          </div>
        )}

        {/* Stats grid */}
        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Tenants */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-300 font-semibold">Clients (Tenants)</h3>
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white">{stats.tenantCount}</div>
              <p className="text-blue-300 text-sm mt-2">Entreprises actives</p>
            </div>

            {/* Users */}
            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-300 font-semibold">Utilisateurs</h3>
                <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM9 20H4v-2a6 6 0 0112 0v2H9z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white">{stats.userCount}</div>
              <p className="text-purple-300 text-sm mt-2">Techniciens et admins</p>
            </div>

            {/* Passages */}
            <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border border-green-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-300 font-semibold">Interventions</h3>
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white">{stats.passageCount}</div>
              <p className="text-green-300 text-sm mt-2">Total complétées</p>
            </div>

            {/* Devis */}
            <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-6 border border-orange-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-300 font-semibold">Devis</h3>
                <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-4xl font-bold text-white">{stats.devisCount}</div>
              <p className="text-orange-300 text-sm mt-2">Générés</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">Impossible de charger les statistiques</p>
          </div>
        )}

        {/* Performance metrics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Uptime */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-gray-300 font-semibold mb-4">Disponibilité</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-green-400">{stats.uptimePercent.toFixed(1)}%</div>
                  <p className="text-gray-500 text-sm mt-2">Uptime sur 7 jours</p>
                </div>
                <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Cache hit rate */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-gray-300 font-semibold mb-4">Cache Performance</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-blue-400">{stats.cacheHitRate.toFixed(1)}%</div>
                  <p className="text-gray-500 text-sm mt-2">Hit rate</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-gray-600 flex items-center justify-center">
                  <span className="text-blue-400 font-semibold">{Math.round(stats.cacheHitRate)}%</span>
                </div>
              </div>
            </div>

            {/* Database size */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-gray-300 font-semibold mb-4">Base de données</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold text-purple-400">{stats.databaseSize}</div>
                  <p className="text-gray-500 text-sm mt-2">Taille totale</p>
                </div>
                <svg className="w-12 h-12 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 12a9 9 0 0118 0v4a9 9 0 01-18 0v-4z" />
                  <path d="M3 8V6a9 9 0 0118 0v2" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Debug info */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-gray-300 font-semibold mb-4">Informations système</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Node version:</span>
              <span className="text-gray-300 ml-2">{process.version}</span>
            </div>
            <div>
              <span className="text-gray-500">Environnement:</span>
              <span className="text-gray-300 ml-2">{process.env.NODE_ENV || 'development'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
