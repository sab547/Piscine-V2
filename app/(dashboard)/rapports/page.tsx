'use client';

import { useState, useCallback } from 'react';
import { Download, Calendar, Droplets, CheckCircle2, Loader2 } from 'lucide-react';
import { mockMissions } from '@/lib/mock-data';
import { StatutPassage } from '@/types';

interface Report {
  id: string;
  missionId: string;
  piscineNom: string;
  adresse: string;
  date: Date;
  ph: number;
  chlore: number;
  temperature: number;
  technicien: string;
}

const reports: Report[] = mockMissions
  .filter((m) => m.statut === StatutPassage.COMPLETE)
  .map((mission, i) => ({
    id: `report_${i}`,
    missionId: mission.id,
    piscineNom: mission.client,
    adresse: mission.adresse,
    date: new Date(mission.datePrevu),
    ph: parseFloat((7.2 + (i * 0.1) % 0.4).toFixed(1)),
    chlore: parseFloat((1.5 + (i * 0.3) % 1.0).toFixed(1)),
    temperature: 25 + (i % 3),
    technicien: 'Karim Benali',
  }));

function buildPdfHtml(report: Report): string {
  const dateStr = report.date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const phStatus = report.ph >= 7.0 && report.ph <= 7.6 ? '✓ Normal' : '⚠ Hors norme';
  const clStatus = report.chlore >= 1.0 && report.chlore <= 3.0 ? '✓ Normal' : '⚠ Hors norme';
  const tempStatus = report.temperature >= 24 && report.temperature <= 28 ? '✓ Normal' : '⚠ Hors norme';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Rapport – ${report.piscineNom}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; color: #1a1a2e; padding: 40px; font-size: 13px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 2px solid #0ea5e9; }
    .brand { font-size: 22px; font-weight: 700; color: #0ea5e9; }
    .brand-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
    .report-num { text-align: right; font-size: 11px; color: #64748b; }
    .report-num strong { display: block; font-size: 14px; color: #1a1a2e; }
    h2 { font-size: 16px; font-weight: 700; margin: 20px 0 10px; color: #0c4a6e; border-left: 3px solid #0ea5e9; padding-left: 8px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin-bottom: 20px; }
    .info-item { display: flex; flex-direction: column; }
    .info-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px; margin-bottom: 2px; }
    .info-value { font-size: 13px; color: #1a1a2e; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    th { background: #f0f9ff; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #0c4a6e; padding: 8px 12px; border: 1px solid #e2e8f0; }
    td { padding: 8px 12px; border: 1px solid #e2e8f0; font-size: 13px; }
    tr:nth-child(even) td { background: #f8fafc; }
    .ok { color: #16a34a; font-weight: 600; }
    .warn { color: #d97706; font-weight: 600; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">PoolTrack</div>
      <div class="brand-sub">Gestion de piscines professionnelle</div>
    </div>
    <div class="report-num">
      <span>Rapport de passage</span>
      <strong>${report.missionId.toUpperCase()}</strong>
      <span>${dateStr}</span>
    </div>
  </div>

  <h2>Informations générales</h2>
  <div class="info-grid">
    <div class="info-item"><span class="info-label">Piscine</span><span class="info-value">${report.piscineNom}</span></div>
    <div class="info-item"><span class="info-label">Adresse</span><span class="info-value">${report.adresse}</span></div>
    <div class="info-item"><span class="info-label">Date d'intervention</span><span class="info-value">${dateStr}</span></div>
    <div class="info-item"><span class="info-label">Technicien</span><span class="info-value">${report.technicien}</span></div>
  </div>

  <h2>Mesures de qualité de l'eau</h2>
  <table>
    <thead>
      <tr><th>Paramètre</th><th>Valeur mesurée</th><th>Norme</th><th>Statut</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>pH</td>
        <td>${report.ph}</td>
        <td>7,0 – 7,6</td>
        <td class="${report.ph >= 7.0 && report.ph <= 7.6 ? 'ok' : 'warn'}">${phStatus}</td>
      </tr>
      <tr>
        <td>Chlore libre</td>
        <td>${report.chlore} ppm</td>
        <td>1,0 – 3,0 ppm</td>
        <td class="${report.chlore >= 1.0 && report.chlore <= 3.0 ? 'ok' : 'warn'}">${clStatus}</td>
      </tr>
      <tr>
        <td>Température</td>
        <td>${report.temperature}°C</td>
        <td>24 – 28°C</td>
        <td class="${report.temperature >= 24 && report.temperature <= 28 ? 'ok' : 'warn'}">${tempStatus}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    Document généré automatiquement par PoolTrack · ${new Date().toLocaleDateString('fr-FR')}
  </div>
</body>
</html>`;
}

async function downloadReportAsPdf(report: Report): Promise<void> {
  const html = buildPdfHtml(report);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.addEventListener('load', () => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
        URL.revokeObjectURL(url);
      }, 1000);
    });
  } else {
    // Fallback: direct download as HTML if popup blocked
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-${report.missionId}-${report.date.toISOString().slice(0, 10)}.html`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

export default function RapportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = useCallback(async (report: Report) => {
    setDownloading(report.id);
    try {
      await downloadReportAsPdf(report);
    } finally {
      setDownloading(null);
    }
  }, []);

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
                    T°: {report.temperature}°C
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDownload(report)}
                disabled={downloading === report.id}
                title="Télécharger le rapport PDF"
                className="p-2 hover:bg-border rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
              >
                {downloading === report.id ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <Download className="w-5 h-5 text-primary" />
                )}
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
