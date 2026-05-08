'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Droplet, FileText, AlertCircle, LogOut } from 'lucide-react';

interface Stats {
  poolCount: number;
  technicianCount: number;
  interventionCount: number;
  alertCount: number;
}

export default function EntreprisePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState<Stats>({
    poolCount: 12,
    technicianCount: 3,
    interventionCount: 24,
    alertCount: 2,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth-token');
    const userRole = localStorage.getItem('user-role');
    const name = localStorage.getItem('user-name');

    if (!token || userRole !== 'pisciniste') {
      router.push('/login');
      return;
    }

    setUserName(name || 'Pisciniste');
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    localStorage.removeItem('tenant-id');
    localStorage.removeItem('user-name');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
            <p className="text-gray-600 mt-1">Bienvenue, {userName}</p>
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
                <p className="text-gray-600 text-sm">Piscines</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.poolCount}</p>
              </div>
              <Droplet className="w-12 h-12 text-blue-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Techniciens</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.technicianCount}</p>
              </div>
              <Users className="w-12 h-12 text-green-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Interventions</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.interventionCount}</p>
              </div>
              <FileText className="w-12 h-12 text-purple-100" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Alertes</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.alertCount}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-100" />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/entreprise/piscines" className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gérer les Piscines</h3>
            <p className="text-gray-600 text-sm mb-4">Ajoutez, modifiez ou supprimez vos piscines</p>
            <div className="text-blue-600 font-semibold flex items-center gap-2">
              Accéder <span>→</span>
            </div>
          </Link>

          <Link href="/entreprise/techniciens" className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gérer les Techniciens</h3>
            <p className="text-gray-600 text-sm mb-4">Créez et gérez votre équipe de techniciens</p>
            <div className="text-blue-600 font-semibold flex items-center gap-2">
              Accéder <span>→</span>
            </div>
          </Link>

          <Link href="/entreprise/clients" className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gérer les Clients</h3>
            <p className="text-gray-600 text-sm mb-4">Consultez la liste de vos propriétaires de piscine</p>
            <div className="text-blue-600 font-semibold flex items-center gap-2">
              Accéder <span>→</span>
            </div>
          </Link>

          <Link href="/entreprise/parametres" className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Paramètres Entreprise</h3>
            <p className="text-gray-600 text-sm mb-4">Mettez à jour vos informations d'entreprise</p>
            <div className="text-blue-600 font-semibold flex items-center gap-2">
              Accéder <span>→</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
