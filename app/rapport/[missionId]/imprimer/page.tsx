'use client';

import { useEffect } from 'react';
import { mockMissions, mockTechnicien, mockNormes } from '@/lib/mock-data';
import { Droplets, CheckCircle2, AlertTriangle, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PrintPageProps {
  params: { missionId: string };
}

function MeasureRow({ label, value, unit, min, max }: {
  label: string; value: number; unit: string; min: number; max: number;
}) {
  const ok = value >= min && value <= max;
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 px-4 text-sm font-semibold text-gray-700">{label}</td>
      <td className="py-3 px-4 text-sm font-mono font-bold text-gray-900">{value} {unit}</td>
      <td className="py-3 px-4 text-sm text-gray-500">{min} – {max} {unit}</td>
      <td className="py-3 px-4">
        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {ok ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
          {ok ? 'Conforme' : 'Hors norme'}
        </span>
      </td>
    </tr>
  );
}

export default function PrintRapportPage({ params }: PrintPageProps) {
  const mission = mockMissions.find((m) => m.id === params.missionId);

  useEffect(() => {
    const timer = setTimeout(() => window.print(), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!mission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Rapport introuvable</p>
      </div>
    );
  }

  const ph = 7.3;
  const chlore = 1.8;
  const temperature = 26;
  const now = new Date();
  const reportNumber = `RPT-${format(now, 'yyyyMM')}-${params.missionId.toUpperCase()}`;

  return (
    <div className="bg-white min-h-screen">
      {/* Print button (no-print) */}
      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2.5 rounded-xl shadow-ocean-sm hover:bg-primary-dark transition-colors"
        >
          <Printer className="w-4 h-4" />
          Télécharger PDF
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-10 print-page">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-[#0B5EA8]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#0B5EA8] rounded-xl flex items-center justify-center">
              <Droplets className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#0B5EA8]" style={{ fontFamily: 'sans-serif' }}>PoolTrack</h1>
              <p className="text-xs text-gray-500">Rapport d'intervention piscine</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">N° rapport</p>
            <p className="text-sm font-bold font-mono text-gray-800">{reportNumber}</p>
            <p className="text-xs text-gray-500 mt-1">{format(now, 'd MMMM yyyy', { locale: fr })}</p>
          </div>
        </div>

        {/* Mission info */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Intervention</p>
            <p className="font-bold text-gray-900 text-sm">{mission.client}</p>
            <p className="text-sm text-gray-600 mt-1">{mission.adresse}</p>
            <p className="text-sm text-gray-600">{mission.heure}</p>
            <p className="text-xs text-gray-400 mt-2">{format(mission.datePrevu, 'EEEE d MMMM yyyy', { locale: fr })}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Technicien</p>
            <p className="font-bold text-gray-900 text-sm">{mockTechnicien.prenom} {mockTechnicien.nom}</p>
            <p className="text-sm text-gray-600 mt-1">{mockTechnicien.email}</p>
            <p className="text-xs text-gray-400 mt-2">Certifié traitement eau</p>
          </div>
        </div>

        {/* Measurements */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Mesures relevées</h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left text-xs font-bold text-gray-500 uppercase">Paramètre</th>
                  <th className="py-2 px-4 text-left text-xs font-bold text-gray-500 uppercase">Valeur</th>
                  <th className="py-2 px-4 text-left text-xs font-bold text-gray-500 uppercase">Norme</th>
                  <th className="py-2 px-4 text-left text-xs font-bold text-gray-500 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody>
                <MeasureRow label="pH" value={ph} unit="pH" min={mockNormes.ph.min} max={mockNormes.ph.max} />
                <MeasureRow label="Chlore libre" value={chlore} unit="ppm" min={mockNormes.chlore.min} max={mockNormes.chlore.max} />
                <MeasureRow label="Température" value={temperature} unit="°C" min={mockNormes.temperature.min} max={mockNormes.temperature.max} />
              </tbody>
            </table>
          </div>
        </div>

        {/* Observations */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Observations</h2>
          <div className="border border-gray-200 rounded-xl p-4 min-h-[80px]">
            <p className="text-sm text-gray-600">
              Intervention réalisée dans les règles de l'art. Eau conforme aux normes en vigueur.
              Équipements vérifiés et fonctionnels. Prochaine intervention recommandée dans 15 jours.
            </p>
          </div>
        </div>

        {/* Signature */}
        <div className="grid grid-cols-2 gap-6 mt-10 pt-6 border-t border-gray-200">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Signature technicien</p>
            <div className="border-b border-gray-300 h-16" />
            <p className="text-xs text-gray-500 mt-2">{mockTechnicien.prenom} {mockTechnicien.nom}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Cachet entreprise</p>
            <div className="border-b border-gray-300 h-16" />
            <p className="text-xs text-gray-500 mt-2">PoolTrack Pro SARL</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            PoolTrack — Rapport généré le {format(now, 'd MMMM yyyy à HH:mm', { locale: fr })} · Ce document a valeur de rapport officiel d'intervention
          </p>
        </div>
      </div>
    </div>
  );
}
