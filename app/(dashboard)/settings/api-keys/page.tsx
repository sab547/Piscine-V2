'use client';

import { useState, useEffect } from 'react';

interface ApiKey {
  id: string;
  name: string;
  expiresAt: string;
  createdAt: string;
  lastUsedAt?: string;
}

interface NewApiKey {
  key: string;
  expiresAt: string;
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [expirationDays, setExpirationDays] = useState(30);
  const [newKey, setNewKey] = useState<NewApiKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/v1/tenant/api-keys');

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des clés');
      }

      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erreur',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!keyName.trim()) {
      setMessage({ type: 'error', text: 'Entrez un nom pour la clé' });
      return;
    }

    setCreating(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/v1/tenant/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: keyName,
          expirationDays,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création');
      }

      const data = await response.json();
      setNewKey({
        key: data.key,
        expiresAt: data.expiresAt,
      });

      setKeyName('');
      setExpirationDays(30);

      // Refresh list
      await fetchApiKeys();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erreur',
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCopyKey = () => {
    if (!newKey) return;

    navigator.clipboard.writeText(newKey.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDismissNewKey = () => {
    setNewKey(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Messages */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* New Key Alert */}
      {newKey && (
        <div className="mb-6 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">✓ Clé API créée avec succès</h3>
              <p className="text-sm text-blue-800 mb-4">
                Voici votre clé API. Notez-la maintenant car vous ne pourrez plus la voir après avoir fermé cette page.
              </p>

              <div className="bg-white p-3 rounded border border-blue-300 font-mono text-sm mb-4 break-all">
                {newKey.key}
              </div>

              <p className="text-xs text-blue-700 mb-4">
                Expire le {new Date(newKey.expiresAt).toLocaleDateString('fr-FR')}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleCopyKey}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
                >
                  {copied ? '✓ Copié' : 'Copier'}
                </button>
                <button
                  onClick={handleDismissNewKey}
                  className="px-4 py-2 border border-blue-300 text-blue-700 rounded text-sm font-medium hover:bg-blue-50 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Key Form */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Créer une nouvelle clé API</h2>
        </div>

        <form onSubmit={handleCreateKey} className="p-8 space-y-4">
          <div>
            <label htmlFor="keyName" className="block text-sm font-semibold text-gray-700 mb-2">
              Nom de la clé
            </label>
            <input
              id="keyName"
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="Ex: Integration mobile"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={creating}
            />
            <p className="text-xs text-gray-600 mt-1">Un nom pour identifier cette clé</p>
          </div>

          <div>
            <label htmlFor="expirationDays" className="block text-sm font-semibold text-gray-700 mb-2">
              Expiration (jours)
            </label>
            <select
              id="expirationDays"
              value={expirationDays}
              onChange={(e) => setExpirationDays(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={creating}
            >
              <option value={7}>7 jours</option>
              <option value={30}>30 jours</option>
              <option value={90}>90 jours</option>
              <option value={365}>1 an</option>
            </select>
            <p className="text-xs text-gray-600 mt-1">La clé expirera après cette durée</p>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
          >
            {creating ? 'Création...' : 'Créer la clé'}
          </button>
        </form>
      </div>

      {/* API Keys List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Clés API actives</h2>
          <p className="text-gray-600 mt-1">Gérez vos clés API pour accéder à l'API PoolTrack</p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Aucune clé API créée. Créez-en une ci-dessus.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Nom</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Créée</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Expire</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Dernier usage</th>
                  <th className="px-8 py-4 text-left text-sm font-semibold text-gray-900">Statut</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key, index) => {
                  const expiresAt = new Date(key.expiresAt);
                  const isExpired = expiresAt < new Date();
                  const isExpiringSoon = !isExpired && expiresAt.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

                  return (
                    <tr key={key.id} className={index !== apiKeys.length - 1 ? 'border-b border-gray-200' : ''}>
                      <td className="px-8 py-4 text-sm text-gray-900 font-medium">{key.name}</td>
                      <td className="px-8 py-4 text-sm text-gray-600">
                        {new Date(key.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-600">
                        {expiresAt.toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-8 py-4 text-sm text-gray-600">
                        {key.lastUsedAt
                          ? new Date(key.lastUsedAt).toLocaleDateString('fr-FR')
                          : 'Jamais'}
                      </td>
                      <td className="px-8 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            isExpired
                              ? 'bg-red-100 text-red-800'
                              : isExpiringSoon
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {isExpired ? 'Expirée' : isExpiringSoon ? 'Bientôt' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
