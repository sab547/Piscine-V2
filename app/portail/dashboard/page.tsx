'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Passage {
  id: string;
  piscineNom: string;
  technicienName: string;
  createdAt: string;
  ph?: number;
  chlore?: number;
  temperature?: number;
}

interface Devis {
  id: string;
  numero: string;
  montantTTC: number;
  statut: string;
  createdAt: string;
}

export default function PortailDashboard() {
  const router = useRouter();
  const [passages, setPassages] = useState<Passage[]>([]);
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1] : null;

    setAuthToken(token || null);

    if (!token) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch passages
        const passageResponse = await fetch('/api/v1/passage', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (passageResponse.ok) {
          const passageData = await passageResponse.json();
          setPassages(passageData);
        }

        // Fetch devis
        const devisResponse = await fetch('/api/v1/devis', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (devisResponse.ok) {
          const devisData = await devisResponse.json();
          setDevis(devisData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">PoolTrack</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded transition"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Votre espace client</h2>
          <p className="text-gray-600 mt-2">Consultez l'historique de maintenance et vos devis</p>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Passages section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Historique d'interventions</h3>
            </div>

            {passages.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                Aucune intervention enregistrée
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {passages.map(passage => (
                  <div key={passage.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{passage.piscineNom}</h4>
                        <p className="text-sm text-gray-600">Technicien: {passage.technicienName}</p>
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {new Date(passage.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    {/* Water quality */}
                    {(passage.ph || passage.chlore || passage.temperature) && (
                      <div className="mt-4 grid grid-cols-3 gap-3">
                        {passage.ph && (
                          <div className="bg-blue-50 p-3 rounded">
                            <p className="text-xs text-gray-600">pH</p>
                            <p className="text-lg font-semibold text-blue-600">{passage.ph}</p>
                          </div>
                        )}
                        {passage.chlore && (
                          <div className="bg-green-50 p-3 rounded">
                            <p className="text-xs text-gray-600">Chlore</p>
                            <p className="text-lg font-semibold text-green-600">{passage.chlore} ppm</p>
                          </div>
                        )}
                        {passage.temperature && (
                          <div className="bg-orange-50 p-3 rounded">
                            <p className="text-xs text-gray-600">Température</p>
                            <p className="text-lg font-semibold text-orange-600">{passage.temperature}°C</p>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => router.push(`/passage/${passage.id}`)}
                      className="mt-4 text-sm text-blue-600 hover:underline font-medium"
                    >
                      Voir le rapport complet →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Devis section */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Vos devis</h3>
            </div>

            {devis.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                Aucun devis disponible
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {devis.map(item => {
                  const statusColors = {
                    BROUILLON: { bg: 'bg-gray-50', text: 'text-gray-700', label: 'Brouillon' },
                    ENVOYE: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Envoyé' },
                    ACCEPTE: { bg: 'bg-green-50', text: 'text-green-700', label: '✓ Accepté' },
                    REFUSE: { bg: 'bg-red-50', text: 'text-red-700', label: 'Refusé' },
                    EXPIRE: { bg: 'bg-yellow-50', text: 'text-yellow-700', label: 'Expiré' },
                  };

                  const status = statusColors[item.statut as keyof typeof statusColors] || statusColors.BROUILLON;

                  return (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">Devis {item.numero}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{item.montantTTC.toFixed(2)}€</p>
                          <span className={`inline-block text-xs font-semibold px-2 py-1 rounded mt-2 ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>

                      {item.statut === 'ENVOYE' && (
                        <button
                          onClick={() => router.push(authToken ? `/portail/${authToken}/devis` : '/portail')}
                          className="text-sm text-blue-600 hover:underline font-medium"
                        >
                          Signer le devis →
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Empty state */}
        {passages.length === 0 && devis.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0010.15 10.15z" />
            </svg>
            <p className="text-gray-600 text-lg">Aucune donnée disponible</p>
            <p className="text-gray-500">Vos interventions et devis s'afficheront ici</p>
          </div>
        )}
      </div>
    </div>
  );
}
