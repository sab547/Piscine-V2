'use client';

import { Download, Calendar, FileText } from 'lucide-react';
import { mockMissions } from '@/lib/mock-data';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function generatePrintUrl(reportId: string) {
  return `/rapport/${reportId}/imprimer`;
}

export default function RapportsPage() {
  const reports = mockMissions
    .filter((m) => m.statut === 'COMPLETE')
    .map((mission, i) => ({
      id: mission.id,
      missionId: mission.id,
      piscineNom: mission.client,
      adresse: mission.adresse,
      date: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000),
      ph: parseFloat((7.1 + Math.random() * 0.5).toFixed(1)),
      chlore: parseFloat((1.4 + Math.random() * 1.2).toFixed(1)),
      temperature: Math.round(24 + Math.random() * 4),
      technicien: 'Karim Benali',
    }));

  const phOk = (v: number) => v >= 7.0 && v <= 7.6;
  const clOk = (v: number) => v >= 1.0 && v <= 3.0;

  return (
    <div className="pb-6 space-y-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-success to-emerald-700 text-white px-5 pt-6 pb-6">
        <h1 className="text-2xl font-bold font-display">Rapports envoyés</h1>
        <p className="text-sm text-white/70 mt-0.5">{reports.length} rapport{reports.length !== 1 ? 's' : ''} ce mois</p>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-xl font-bold font-mono">{reports.length}</p>
            <p className="text-[10px] text-white/70">Total</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-xl font-bold font-mono">7.2</p>
            <p className="text-[10px] text-white/70">pH moy.</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-xl font-bold font-mono">1.8</p>
            <p className="text-[10px] text-white/70">Cl moy.</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-3">
        {reports.map((report) => {
          const allOk = phOk(report.ph) && clOk(report.chlore);
          return (
            <div
              key={report.id}
              className="bg-white border border-border/70 rounded-2xl p-4 shadow-[0_1px_4px_rgba(11,94,168,0.06)] space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${allOk ? 'bg-success/10' : 'bg-warning/10'}`}>
                    <FileText className={`w-5 h-5 ${allOk ? 'text-success' : 'text-warning'}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-text text-sm truncate">{report.piscineNom}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${allOk ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        {allOk ? 'Conforme' : 'Attention'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span>{format(report.date, 'EEEE d MMM yyyy · HH:mm', { locale: fr })}</span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">par {report.technicien}</p>
                  </div>
                </div>

                <button
                  onClick={() => window.open(generatePrintUrl(report.missionId), '_blank')}
                  className="p-2.5 bg-surface hover:bg-primary/10 active:scale-95 rounded-xl transition-all flex-shrink-0"
                  title="Télécharger PDF"
                >
                  <Download className="w-4 h-4 text-primary" />
                </button>
              </div>

              {/* Measurements */}
              <div className="flex gap-2 flex-wrap pt-1 border-t border-border/50">
                <MeasureBadge
                  label="pH"
                  value={report.ph.toFixed(1)}
                  ok={phOk(report.ph)}
                />
                <MeasureBadge
                  label="Cl"
                  value={`${report.chlore.toFixed(1)} ppm`}
                  ok={clOk(report.chlore)}
                />
                <MeasureBadge
                  label="T°"
                  value={`${report.temperature}°C`}
                  ok={true}
                />
              </div>
            </div>
          );
        })}

        {reports.length === 0 && (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FileText className="w-7 h-7 text-text-muted" />
            </div>
            <p className="font-semibold text-text-muted">Aucun rapport envoyé</p>
            <p className="text-xs text-text-muted mt-1">Les rapports apparaîtront ici après chaque passage</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MeasureBadge({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${ok ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-success' : 'bg-warning'}`} />
      {label} : {value}
    </div>
  );
}
