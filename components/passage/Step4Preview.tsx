'use client';

import { Download } from 'lucide-react';

interface PreviewData {
  photoBefore?: string;
  photoAfter?: string;
  ph?: number;
  chlore?: number;
  temperature?: number;
  piscineNom?: string;
  proprietaireEmail?: string;
}

function StatusBadge({ value, min, max }: { value?: number; min: number; max: number }) {
  if (value === undefined) return null;

  const isValid = value >= min && value <= max;
  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isValid
          ? 'bg-success/20 text-success'
          : 'bg-danger/20 text-danger'
      }`}
    >
      {isValid ? 'Optimal' : 'Attention'}
    </div>
  );
}

export function Step4Preview({
  photoBefore,
  photoAfter,
  ph,
  chlore,
  temperature,
  piscineNom = 'Votre piscine',
  proprietaireEmail = 'client@example.com',
}: PreviewData) {
  return (
    <div className="px-4 py-6 space-y-6">
      <h2 className="text-2xl font-bold text-text font-display">
        Aperçu du rapport
      </h2>

      <p className="text-sm text-text-muted">
        Ceci est un aperçu du rapport qui sera envoyé à :
        <br />
        <span className="font-semibold text-text">{proprietaireEmail}</span>
      </p>

      <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
        <h3 className="text-lg font-semibold text-text">{piscineNom}</h3>

        {(photoBefore || photoAfter) && (
          <div className="grid grid-cols-2 gap-3">
            {photoBefore && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img
                  src={photoBefore}
                  alt="Avant"
                  className="w-full aspect-square object-cover"
                />
                <p className="bg-white text-xs font-semibold text-text text-center py-2">
                  Avant
                </p>
              </div>
            )}
            {photoAfter && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img
                  src={photoAfter}
                  alt="Après"
                  className="w-full aspect-square object-cover"
                />
                <p className="bg-success/10 text-xs font-semibold text-success text-center py-2">
                  Après
                </p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-semibold text-text">Paramètres mesurés</p>

          <div className="grid grid-cols-3 gap-2">
            {ph !== undefined && (
              <div className="bg-white border border-border rounded-lg p-3">
                <p className="text-xs text-text-muted">pH</p>
                <p className="text-lg font-bold text-text font-mono">{ph}</p>
                <StatusBadge value={ph} min={7.0} max={7.6} />
              </div>
            )}

            {chlore !== undefined && (
              <div className="bg-white border border-border rounded-lg p-3">
                <p className="text-xs text-text-muted">Chlore</p>
                <p className="text-lg font-bold text-text font-mono">{chlore}</p>
                <StatusBadge value={chlore} min={1.0} max={3.0} />
              </div>
            )}

            {temperature !== undefined && (
              <div className="bg-white border border-border rounded-lg p-3">
                <p className="text-xs text-text-muted">Temp.</p>
                <p className="text-lg font-bold text-text font-mono">
                  {temperature}°
                </p>
                <StatusBadge value={temperature} min={24} max={28} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary rounded-lg p-4">
        <p className="text-sm font-semibold text-primary">
          ✓ Votre pisciniste utilise PoolTrack
        </p>
        <p className="text-xs text-primary/80 mt-2">
          Chaque intervention est documentée, photographiée et archivée pour vous.
        </p>
      </div>
    </div>
  );
}
