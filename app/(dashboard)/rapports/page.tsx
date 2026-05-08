'use client';

import { Download, Calendar, Droplets, CheckCircle2 } from 'lucide-react';
import { mockMissions, mockPiscines } from '@/lib/mock-data';

export default function RapportsPage() {
  const reports = mockMissions
    .filter((m) => m.statut === 'COMPLETE')
    .map((mission, i) => ({
      id: `report_${i}`,
      missionId: mission.id,
      piscineNom: mission.client,
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      ph: 7.2 + Math.random() * 0.4,
      chlore: 1.5 + Math.random() * 1.0,
      temperature: 25 + Math.random() * 3,
    }));

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-text font-display">
        Rapports envoyés
      </h1>

      <div className="space-y-3">
        <p className="text-sm text-text-muted font-semibold">
          {reports.length} rapport{reports.length !== 1 ? 's' : ''}
        </p>

        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-surface border border-border hover:border-primary rounded-lg p-4 space-y-3 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <h3 className="font-semibold text-text">
                    {report.piscineNom}
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <Calendar className="w-3 h-3" />
                  {report.date.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

                <div className="flex gap-2 flex-wrap text-xs mt-2">
                  <span className="bg-accent/20 text-accent px-2 py-1 rounded-full font-semibold">
                    pH: {report.ph.toFixed(1)}
                  </span>
                  <span className="bg-accent/20 text-accent px-2 py-1 rounded-full font-semibold">
                    Cl: {report.chlore.toFixed(1)} ppm
                  </span>
                  <span className="bg-accent/20 text-accent px-2 py-1 rounded-full font-semibold">
                    T°: {Math.round(report.temperature)}°C
                  </span>
                </div>
              </div>

              <button className="p-2 hover:bg-border rounded-lg transition-colors flex-shrink-0">
                <Download className="w-5 h-5 text-primary" />
              </button>
            </div>
          </div>
        ))}

        {reports.length === 0 && (
          <div className="text-center py-8">
            <Droplets className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="text-text-muted">Aucun rapport envoyé</p>
          </div>
        )}
      </div>
    </div>
  );
}
