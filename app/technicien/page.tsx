'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Clock, AlertCircle, LogOut, Calendar } from 'lucide-react';

export default function TechnicienPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [missions, setMissions] = useState([
    {
      id: '1',
      piscineNom: 'Piscine Municipale',
      date: '2026-05-09',
      heure: '09:00',
      status: 'Planifiée',
    },
    {
      id: '2',
      piscineNom: 'Piscine Privée Dupont',
      date: '2026-05-09',
      heure: '14:00',
      status: 'Planifiée',
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const userRole = localStorage.getItem('user-role');
    const name = localStorage.getItem('user-name');

    if (!token) {
      router.push('/login');
      return;
    }

    // Technicien ou pisciniste qui est aussi technicien
    if (userRole !== 'technicien' && userRole !== 'pisciniste') {
      router.push('/login');
      return;
    }

    setUserName(name || 'Technicien');
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
            <h1 className="text-3xl font-bold text-gray-900">Espace Technicien</h1>
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
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/technicien/piscines" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-4 cursor-pointer transition">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Mes Piscines</h3>
                <p className="text-sm text-blue-100">Voir toutes les piscines</p>
              </div>
            </div>
          </Link>

          <Link href="/technicien/planning" className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-4 cursor-pointer transition">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Planning</h3>
                <p className="text-sm text-green-100">Voir le calendrier</p>
              </div>
            </div>
          </Link>

          <Link href="/technicien/interventions" className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-4 cursor-pointer transition">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Interventions</h3>
                <p className="text-sm text-purple-100">Gérer vos passages</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Missions Today */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Missions du Jour</h2>
          </div>

          {missions.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              Aucune mission prévue aujourd'hui
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {missions.map(mission => (
                <div key={mission.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{mission.piscineNom}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {mission.heure}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(mission.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      mission.status === 'Planifiée'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {mission.status}
                    </span>
                  </div>
                  <Link
                    href={`/technicien/mission/${mission.id}`}
                    className="text-blue-600 hover:underline text-sm font-semibold mt-3 inline-block"
                  >
                    Voir détails →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
