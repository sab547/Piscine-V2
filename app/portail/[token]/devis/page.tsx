'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SignatureCapture from '@/components/devis/SignatureCapture';

interface Devis {
  id: string;
  numero: string;
  piscineNom: string;
  proprietaireNom: string;
  proprietaireEmail: string;
  description: string;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
  statut: string;
  valableJusqu: string;
  createdAt: string;
}

export default function DevisPortalPage() {
  const params = useParams();
  const router = useRouter();
  const [devis, setDevis] = useState<Devis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [signing, setSigning] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [signerName, setSignerName] = useState('');

  const token = params.token as string;

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const response = await fetch(`/api/v1/devis/${token}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Devis introuvable ou expiré');
        }

        const data = await response.json();
        setDevis(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du devis');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDevis();
    }
  }, [token]);

  const handleSignature = async (signatureDataUrl: string) => {
    if (!devis || !signerName.trim()) {
      setError('Veuillez entrer votre nom');
      return;
    }

    setSigning(true);
    try {
      const response = await fetch(`/api/v1/devis/${devis.id}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          devisId: devis.id,
          signature: signatureDataUrl,
          signerName,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la signature');
      }

      setError('');
      router.push('/portail/success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la signature');
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !devis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow p-8 max-w-md w-full">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Erreur</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!devis) {
    return null;
  }

  const isExpired = new Date(devis.valableJusqu) < new Date();
  const isAlreadySigned = devis.statut === 'ACCEPTE';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Devis PoolTrack</h1>
            <p className="text-blue-100 mt-1">Veuillez examiner et signer votre devis</p>
          </div>

          {/* Status badges */}
          <div className="px-8 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
              isAlreadySigned
                ? 'bg-green-100 text-green-800'
                : isExpired
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {isAlreadySigned ? '✓ Signé' : isExpired ? 'Expiré' : 'En attente de signature'}
            </div>
            <div className="text-sm text-gray-600">
              Valable jusqu'au {new Date(devis.valableJusqu).toLocaleDateString('fr-FR')}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-sm font-semibold text-gray-600 uppercase mb-4">Informations du client</h2>
                <div className="space-y-2">
                  <p><span className="font-semibold">Nom:</span> {devis.proprietaireNom}</p>
                  <p><span className="font-semibold">Email:</span> {devis.proprietaireEmail}</p>
                  <p><span className="font-semibold">Piscine:</span> {devis.piscineNom}</p>
                </div>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-600 uppercase mb-4">Numéro de devis</h2>
                <p className="text-2xl font-bold text-blue-600">{devis.numero}</p>
                <p className="text-sm text-gray-600 mt-2">
                  Créé le {new Date(devis.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Travaux à effectuer</h3>
              <p className="text-gray-700">{devis.description}</p>
            </div>

            {/* Pricing table */}
            <table className="w-full mb-8 border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 text-gray-700">Montant HT</td>
                  <td className="py-3 text-right font-semibold">{devis.montantHT.toFixed(2)}€</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 text-gray-700">TVA</td>
                  <td className="py-3 text-right font-semibold">{devis.montantTVA.toFixed(2)}€</td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-3 font-semibold text-blue-900">Total TTC</td>
                  <td className="py-3 text-right text-2xl font-bold text-blue-600">
                    {devis.montantTTC.toFixed(2)}€
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Signing section */}
            {!isAlreadySigned && !isExpired && (
              <>
                {!showSignature ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="font-semibold text-green-900 mb-2">Accepter ce devis</h3>
                    <p className="text-green-800 text-sm mb-4">
                      En signant ce devis, vous acceptez les conditions et confirmez votre accord pour les travaux décrits ci-dessus.
                    </p>
                    <button
                      onClick={() => setShowSignature(true)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                      disabled={signing}
                    >
                      {signing ? 'Signature en cours...' : 'Signer le devis'}
                    </button>
                  </div>
                ) : (
                  <div className="border rounded-lg p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Votre signature</h3>

                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Votre nom complet
                      </label>
                      <input
                        type="text"
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        placeholder="Entrez votre nom"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <SignatureCapture
                      onSign={handleSignature}
                      loading={signing}
                      onCancel={() => setShowSignature(false)}
                    />
                  </div>
                )}
              </>
            )}

            {isAlreadySigned && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold text-green-900">Devis signé</p>
                    <p className="text-green-800 text-sm">Merci d'avoir accepté ce devis. Nous vous contacterons bientôt.</p>
                  </div>
                </div>
              </div>
            )}

            {isExpired && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-900">Devis expiré</p>
                    <p className="text-red-800 text-sm">Ce devis a expiré et ne peut plus être signé. Veuillez demander un nouveau devis.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>Besoin d'aide? <a href="mailto:support@pooltrack.fr" className="text-blue-600 hover:underline">Contactez notre support</a></p>
        </div>
      </div>
    </div>
  );
}
