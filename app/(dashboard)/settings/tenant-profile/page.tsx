'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TenantProfile {
  siret: string;
  phone: string;
  supportEmail: string;
}

export default function TenantProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<TenantProfile>({
    siret: '',
    phone: '',
    supportEmail: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/v1/tenant/profile');

        if (!response.ok) {
          throw new Error('Erreur lors du chargement du profil');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : 'Erreur',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field: keyof TenantProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/v1/tenant/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde');
      }

      setMessage({
        type: 'success',
        text: 'Profil mis à jour avec succès',
      });

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erreur',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="px-8 py-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Informations Entreprise</h1>
          <p className="text-gray-600 mt-1">Gérez les informations de votre entreprise</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Messages */}
          {message.text && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* SIRET */}
          <div>
            <label htmlFor="siret" className="block text-sm font-semibold text-gray-700 mb-2">
              SIRET
            </label>
            <input
              id="siret"
              type="text"
              value={profile.siret}
              onChange={(e) => handleChange('siret', e.target.value)}
              placeholder="14 chiffres du SIRET"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              pattern="\d{14}"
              title="Le SIRET doit contenir 14 chiffres"
            />
            <p className="text-xs text-gray-600 mt-1">Numéro SIRET de votre entreprise (14 chiffres)</p>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              id="phone"
              type="tel"
              value={profile.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Format: +33 1 23 45 67 89"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-600 mt-1">Numéro de téléphone professionnel</p>
          </div>

          {/* Support Email */}
          <div>
            <label htmlFor="supportEmail" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Support
            </label>
            <input
              id="supportEmail"
              type="email"
              value={profile.supportEmail}
              onChange={(e) => handleChange('supportEmail', e.target.value)}
              placeholder="support@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-600 mt-1">Email utilisé pour les communications avec vos clients</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
