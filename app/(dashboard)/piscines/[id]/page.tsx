'use client';

import { MapPin, Wrench, AlertCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { mockPiscines } from '@/lib/mock-data';

interface PoolDetailsPageProps {
  params: {
    id: string;
  };
}

export default function PoolDetailsPage({ params }: PoolDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'anomalies'>(
    'info'
  );

  const piscine = mockPiscines.find((p) => p.id === params.id);

  if (!piscine) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-lg font-semibold text-text">Piscine non trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-accent to-primary text-white px-4 py-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">{piscine.nom}</h1>
            <div className="flex items-center gap-2 text-white/80 mt-2">
              <MapPin className="w-4 h-4" />
              <p className="text-sm">
                {piscine.adresse}, {piscine.ville}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <p className="text-white/70 text-xs">Type</p>
            <p className="font-semibold">
              {piscine.type === 'PRIVEE'
                ? 'Privée'
                : piscine.type === 'COPROPRIETE'
                  ? 'Copropriété'
                  : 'Hôtel'}
            </p>
          </div>
          {piscine.volume && (
            <div className="bg-white/20 rounded-lg px-3 py-2">
              <p className="text-white/70 text-xs">Volume</p>
              <p className="font-semibold">{piscine.volume}L</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <div className="flex gap-2 border-b border-border">
          {['info', 'history', 'anomalies'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-3 px-4 font-semibold text-sm transition-colors border-b-2 ${
                activeTab === tab
                  ? 'text-primary border-primary'
                  : 'text-text-muted border-transparent hover:text-text'
              }`}
            >
              {tab === 'info'
                ? 'Infos'
                : tab === 'history'
                  ? 'Historique'
                  : 'Anomalies'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-6">
        {activeTab === 'info' && (
          <div className="space-y-4">
            {piscine.equipements.length > 0 && (
              <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-text flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Équipements
                </h3>
                <ul className="space-y-2">
                  {piscine.equipements.map((equip, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {equip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {piscine.note && (
              <div className="bg-accent/10 border border-accent rounded-lg p-4">
                <h3 className="font-semibold text-text mb-2">Notes</h3>
                <p className="text-sm text-text-muted">{piscine.note}</p>
              </div>
            )}

            <div className="bg-primary/10 border border-primary rounded-lg p-4">
              <p className="text-xs text-primary font-semibold mb-2">
                Créé le {new Date(piscine.createdAt).toLocaleDateString('fr-FR')}
              </p>
              <p className="text-xs text-primary/80">
                ID : {piscine.id.slice(0, 8)}...
              </p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-lg p-4 flex items-start gap-3"
              >
                <Calendar className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-text text-sm">
                    Passage #{i}
                  </p>
                  <p className="text-xs text-text-muted">
                    {new Date(
                      Date.now() - i * 24 * 60 * 60 * 1000
                    ).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                      pH: 7.2
                    </span>
                    <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                      Cl: 1.8
                    </span>
                    <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                      T°: 26°C
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'anomalies' && (
          <div className="space-y-3">
            <div className="bg-warning/10 border border-warning rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-text text-sm">
                  pH légèrement élevé
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Dernier passage : pH 7.8 (norme: 7.0-7.6)
                </p>
                <button className="text-xs font-semibold text-warning hover:text-warning/80 mt-2">
                  Voir le rapport →
                </button>
              </div>
            </div>

            <div className="text-center py-6 text-text-muted text-sm">
              Aucune autre anomalie active
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
