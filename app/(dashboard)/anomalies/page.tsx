'use client';

import { AlertCircle, CheckCircle2, Wrench, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Anomaly {
  id: string;
  piscine: string;
  description: string;
  severity: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
  createdAt: Date;
  resolved: boolean;
}

const mockAnomalies: Anomaly[] = [
  {
    id: 'anom_1',
    piscine: 'Villa Martinez',
    description: 'pH en alerte - 7.8 (norme: 7.0-7.6)',
    severity: 'MOYENNE',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    resolved: false,
  },
  {
    id: 'anom_2',
    piscine: 'Résidence Les Pins',
    description: 'Chlore hors norme - 0.5 ppm (norme: 1.0-3.0)',
    severity: 'HAUTE',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    resolved: false,
  },
  {
    id: 'anom_3',
    piscine: 'Villa Durand',
    description: 'Température légèrement basse - 23°C',
    severity: 'FAIBLE',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    resolved: true,
  },
];

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'HAUTE':
      return 'bg-danger/10 border-danger text-danger';
    case 'MOYENNE':
      return 'bg-warning/10 border-warning text-warning';
    case 'FAIBLE':
      return 'bg-accent/10 border-accent text-accent';
    default:
      return 'bg-surface border-border text-text';
  }
}

function getSeverityLabel(severity: string) {
  switch (severity) {
    case 'HAUTE':
      return 'Critique';
    case 'MOYENNE':
      return 'Moyenne';
    case 'FAIBLE':
      return 'Faible';
    default:
      return severity;
  }
}

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState(mockAnomalies);

  const activeAnomalies = anomalies.filter((a) => !a.resolved);
  const resolvedAnomalies = anomalies.filter((a) => a.resolved);

  const toggleResolved = (id: string) => {
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: !a.resolved } : a))
    );
  };

  const deleteAnomaly = (id: string) => {
    setAnomalies((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-text font-display">
        Anomalies
      </h1>

      {/* Active Anomalies */}
      {activeAnomalies.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-text">
            Anomalies actives ({activeAnomalies.length})
          </h2>

          {activeAnomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              className={`border rounded-lg p-4 space-y-3 transition-all ${getSeverityColor(
                anomaly.severity
              )}`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{anomaly.piscine}</h3>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/20">
                      {getSeverityLabel(anomaly.severity)}
                    </span>
                  </div>

                  <p className="text-sm">{anomaly.description}</p>

                  <p className="text-xs opacity-75">
                    Détecté il y a{' '}
                    {Math.round(
                      (Date.now() - anomaly.createdAt.getTime()) /
                        (60 * 60 * 1000)
                    )}{' '}
                    h
                  </p>
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleResolved(anomaly.id)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Marquer comme résolu"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolved Anomalies */}
      {resolvedAnomalies.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-text">
            Anomalies résolues ({resolvedAnomalies.length})
          </h2>

          {resolvedAnomalies.map((anomaly) => (
            <div
              key={anomaly.id}
              className="bg-success/10 border border-success/30 rounded-lg p-4 space-y-3 opacity-75"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-text line-through">
                      {anomaly.piscine}
                    </h3>
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-success/20 text-success">
                      Résolu
                    </span>
                  </div>

                  <p className="text-sm text-text-muted">{anomaly.description}</p>
                </div>

                <button
                  onClick={() => deleteAnomaly(anomaly.id)}
                  className="p-2 hover:bg-success/20 rounded-lg transition-colors flex-shrink-0"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5 text-success" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeAnomalies.length === 0 && resolvedAnomalies.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
          <p className="text-text-muted">Aucune anomalie détectée</p>
        </div>
      )}
    </div>
  );
}
