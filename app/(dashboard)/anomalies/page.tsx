'use client';

import { AlertTriangle, CheckCircle2, Trash2, FileText, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Anomaly {
  id: string;
  piscine: string;
  description: string;
  severity: 'HAUTE' | 'MOYENNE' | 'FAIBLE';
  createdAt: Date;
  resolved: boolean;
}

const INITIAL_ANOMALIES: Anomaly[] = [
  {
    id: 'anom_1',
    piscine: 'Villa Martinez',
    description: 'pH en alerte — 7.8 (norme : 7.0–7.6)',
    severity: 'MOYENNE',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    resolved: false,
  },
  {
    id: 'anom_2',
    piscine: 'Résidence Les Pins',
    description: 'Chlore hors norme — 0.5 ppm (norme : 1.0–3.0)',
    severity: 'HAUTE',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    resolved: false,
  },
  {
    id: 'anom_3',
    piscine: 'Villa Durand',
    description: 'Température légèrement basse — 23°C (norme : 24–28)',
    severity: 'FAIBLE',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    resolved: true,
  },
];

const SEVERITY_CONFIG = {
  HAUTE: {
    label: 'Critique',
    cardClass: 'bg-danger/5 border-danger/30',
    badgeClass: 'bg-danger/10 text-danger',
    iconClass: 'text-danger',
    iconBg: 'bg-danger/10',
  },
  MOYENNE: {
    label: 'Moyenne',
    cardClass: 'bg-warning/5 border-warning/30',
    badgeClass: 'bg-warning/10 text-warning',
    iconClass: 'text-warning',
    iconBg: 'bg-warning/10',
  },
  FAIBLE: {
    label: 'Faible',
    cardClass: 'bg-primary/5 border-primary/20',
    badgeClass: 'bg-primary/10 text-primary',
    iconClass: 'text-primary',
    iconBg: 'bg-primary/10',
  },
};

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState(INITIAL_ANOMALIES);

  const active = anomalies.filter((a) => !a.resolved);
  const resolved = anomalies.filter((a) => a.resolved);

  const toggleResolved = (id: string) =>
    setAnomalies((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: !a.resolved } : a)));

  const remove = (id: string) =>
    setAnomalies((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="pb-6 space-y-0">
      {/* Header */}
      <div className={`text-white px-5 pt-6 pb-6 ${active.length > 0 ? 'bg-gradient-to-br from-danger to-red-700' : 'bg-gradient-to-br from-success to-emerald-700'}`}>
        <div className="flex items-center gap-3 mb-1">
          <ShieldAlert className="w-6 h-6 text-white/80" />
          <h1 className="text-2xl font-bold font-display">Anomalies</h1>
        </div>
        <p className="text-sm text-white/70">
          {active.length > 0 ? `${active.length} anomalie${active.length > 1 ? 's' : ''} active${active.length > 1 ? 's' : ''}` : 'Tout est conforme ✓'}
        </p>
      </div>

      <div className="px-4 pt-5 space-y-6">
        {/* Active anomalies */}
        {active.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-text uppercase tracking-wider">
              Anomalies actives ({active.length})
            </h2>

            {active.map((anomaly) => {
              const cfg = SEVERITY_CONFIG[anomaly.severity];
              const hoursAgo = Math.round((Date.now() - anomaly.createdAt.getTime()) / (60 * 60 * 1000));

              return (
                <div
                  key={anomaly.id}
                  className={`border rounded-2xl p-4 space-y-3 transition-all ${cfg.cardClass}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconBg}`}>
                      <AlertTriangle className={`w-5 h-5 ${cfg.iconClass}`} />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-text text-sm">{anomaly.piscine}</h3>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${cfg.badgeClass}`}>
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-sm text-text">{anomaly.description}</p>
                      <p className="text-xs text-text-muted">
                        Détecté {hoursAgo < 24 ? `il y a ${hoursAgo}h` : format(anomaly.createdAt, 'd MMM à HH:mm', { locale: fr })}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleResolved(anomaly.id)}
                      className="p-2.5 hover:bg-white/60 active:scale-95 rounded-xl transition-all flex-shrink-0"
                      title="Marquer résolu"
                    >
                      <CheckCircle2 className={`w-5 h-5 ${cfg.iconClass}`} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1 border-t border-current/10">
                    <Link
                      href={`/devis?anomalie=${encodeURIComponent(anomaly.description)}&piscine=${encodeURIComponent(anomaly.piscine)}`}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white/70 hover:bg-white active:scale-95 text-text font-semibold text-xs py-2 px-3 rounded-xl transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Générer un devis
                    </Link>
                    <button
                      onClick={() => toggleResolved(anomaly.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white/70 hover:bg-white active:scale-95 text-text font-semibold text-xs py-2 px-3 rounded-xl transition-all"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                      Résoudre
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Resolved anomalies */}
        {resolved.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider">
              Résolues ({resolved.length})
            </h2>

            {resolved.map((anomaly) => (
              <div
                key={anomaly.id}
                className="bg-white border border-border/60 rounded-2xl p-4 flex items-center gap-3 opacity-70"
              >
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text text-sm line-through">{anomaly.piscine}</p>
                  <p className="text-xs text-text-muted truncate">{anomaly.description}</p>
                </div>
                <button
                  onClick={() => remove(anomaly.id)}
                  className="p-2 hover:bg-danger/10 active:scale-95 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4 text-danger" />
                </button>
              </div>
            ))}
          </div>
        )}

        {active.length === 0 && resolved.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7 text-success" />
            </div>
            <p className="font-bold text-text">Aucune anomalie</p>
            <p className="text-xs text-text-muted mt-1">Toutes les piscines sont dans les normes</p>
          </div>
        )}
      </div>
    </div>
  );
}
