'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Droplets, Wrench, LogOut, Settings, Eye, Lock, ExternalLink } from 'lucide-react';

interface Entity {
  id: string;
  name: string;
  type: 'pisciniste' | 'technicien' | 'proprietaire';
  status: 'actif' | 'inactif';
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [entities, setEntities] = useState<Entity[]>([
    { id: '1', name: 'Piscine Services SA', type: 'pisciniste', status: 'actif', createdAt: '2026-01-15' },
    { id: '2', name: 'Aqua Maintenance', type: 'pisciniste', status: 'actif', createdAt: '2026-02-01' },
    { id: '3', name: 'Jean Dupont', type: 'technicien', status: 'actif', createdAt: '2026-02-10' },
    { id: '4', name: 'Marie Martin', type: 'proprietaire', status: 'actif', createdAt: '2026-03-05' },
  ]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pisciniste' | 'technicien' | 'proprietaire'>('all');

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const role = localStorage.getItem('user-role');
    const name = localStorage.getItem('user-name');

    if (!token || role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    setUserName(name || 'Administrateur');
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    localStorage.removeItem('user-name');
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    router.push('/');
  };

  const filteredEntities = filter === 'all' 
    ? entities 
    : entities.filter(e => e.type === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Admin</h1>
            <p className="text-gray-600 mt-1">Gestion complète de la plateforme</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Piscinistes/Entreprises</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {entities.filter(e => e.type === 'pisciniste').length}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Techniciens</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {entities.filter(e => e.type === 'technicien').length}
                </p>
              </div>
              <Wrench className="w-12 h-12 text-green-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Propriétaires</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {entities.filter(e => e.type === 'proprietaire').length}
                </p>
              </div>
              <Droplets className="w-12 h-12 text-purple-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Utilisateurs</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">{entities.length}</p>
              </div>
              <Users className="w-12 h-12 text-indigo-100" />
            </div>
          </div>
        </div>

        {/* Management Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Gestion des Utilisateurs</h2>
          </div>

          {/* Filter Tabs */}
          <div className="px-6 py-4 border-b border-gray-200 flex gap-4">
            {(['all', 'pisciniste', 'technicien', 'proprietaire'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === type
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'Tous' : type === 'pisciniste' ? 'Entreprises' : type === 'technicien' ? 'Techniciens' : 'Propriétaires'}
              </button>
            ))}
          </div>

          {/* Entities List */}
          <div className="divide-y divide-gray-200">
            {filteredEntities.map(entity => (
              <div key={entity.id} className="px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {entity.type === 'pisciniste' && <Users className="w-5 h-5 text-blue-600" />}
                      {entity.type === 'technicien' && <Wrench className="w-5 h-5 text-green-600" />}
                      {entity.type === 'proprietaire' && <Droplets className="w-5 h-5 text-purple-600" />}
                      <div>
                        <h3 className="font-semibold text-gray-900">{entity.name}</h3>
                        <p className="text-sm text-gray-600">
                          {entity.type === 'pisciniste' && 'Entreprise/Pisciniste'}
                          {entity.type === 'technicien' && 'Technicien'}
                          {entity.type === 'proprietaire' && 'Propriétaire'}
                          {' '} • Créé le {new Date(entity.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      entity.status === 'actif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {entity.status === 'actif' ? 'Actif' : 'Inactif'}
                    </span>
                    <Link
                      href={entity.type === 'pisciniste' ? '/admin/clients' : entity.type === 'technicien' ? '/admin/techniciens' : '/admin/clients'}
                      className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/clients" className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 flex items-center gap-2">Gérer les Entreprises <ExternalLink className="w-4 h-4" /></h3>
                <p className="text-sm text-blue-700 mt-1">Créer, modifier ou supprimer les entreprises piscinistes</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/techniciens" className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <Wrench className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 flex items-center gap-2">Gérer les Techniciens <ExternalLink className="w-4 h-4" /></h3>
                <p className="text-sm text-green-700 mt-1">Assigner des techniciens aux entreprises</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/clients" className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <Droplets className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 flex items-center gap-2">Gérer les Propriétaires <ExternalLink className="w-4 h-4" /></h3>
                <p className="text-sm text-purple-700 mt-1">Consulter les propriétaires de piscines</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/cache" className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <Settings className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-indigo-900 flex items-center gap-2">Paramètres Système <ExternalLink className="w-4 h-4" /></h3>
                <p className="text-sm text-indigo-700 mt-1">Configuration globale de la plateforme</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold">Espace administrateur sécurisé</p>
            <p className="mt-1">Vous avez un accès complet à tous les utilisateurs et paramètres de la plateforme. Toutes les actions sont enregistrées.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
