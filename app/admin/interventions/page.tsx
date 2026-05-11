'use client';

import { Calendar, MapPin, User, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { mockMissions, getStatusLabel, getStatusColor } from '@/lib/mock-data';
import { StatutPassage } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const FILTERS = [
  { key: 'all', label: 'Toutes' },
  { key: StatutPassage.PLANIFIE, label: 'Planifiées' },
  { key: StatutPassage.EN_COURS, label: 'En cours' },
  { key: StatutPassage.COMPLETE, label: 'Terminées' },
  { key: StatutPassage.ANNULE, label: 'Annulées' },
];

export default function AdminInterventionsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const interventions = mockMissions.map((mission, i) => ({
    id: mission.id,
    piscine: mission.client,
    adresse: mission.adresse,
    statut: mission.statut,
    heure: mission.heure,
    datePrevu: mission.datePrevu,
    technicien: 'Karim Benali',
  }));

  const filtered = statusFilter === 'all'
    ? interventions
    : interventions.filter(i => i.statut === statusFilter);

  const counts = {
    all: interventions.length,
    [StatutPassage.PLANIFIE]: interventions.filter(i => i.statut === StatutPassage.PLANIFIE).length,
    [StatutPassage.EN_COURS]: interventions.filter(i => i.statut === StatutPassage.EN_COURS).length,
    [StatutPassage.COMPLETE]: interventions.filter(i => i.statut === StatutPassage.COMPLETE).length,
    [StatutPassage.ANNULE]: interventions.filter(i => i.statut === StatutPassage.ANNULE).length,
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-text font-display">Interventions</h2>
        <p className="text-sm text-text-muted mt-0.5">{interventions.length} intervention{interventions.length > 1 ? 's' : ''} au total</p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
              statusFilter === key
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white border border-border text-text-muted hover:border-primary/40'
            }`}
          >
            {label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${statusFilter === key ? 'bg-white/20' : 'bg-border'}`}>
              {counts[key as keyof typeof counts] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((intervention) => (
          <div
            key={intervention.id}
            className="bg-white border border-border/70 rounded-2xl shadow-[0_1px_4px_rgba(11,94,168,0.06)] hover:border-primary/20 hover:shadow-ocean-sm active:scale-[0.99] transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3 p-4">
              {/* Status bar */}
              <div className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${
                intervention.statut === StatutPassage.COMPLETE ? 'bg-success' :
                intervention.statut === StatutPassage.EN_COURS ? 'bg-warning' :
                intervention.statut === StatutPassage.ANNULE ? 'bg-danger' :
                'bg-border'
              }`} />

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-text text-sm">{intervention.piscine}</h3>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${getStatusColor(intervention.statut as any)}`}>
                    {getStatusLabel(intervention.statut as any)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{intervention.adresse}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(intervention.datePrevu, 'E d MMM', { locale: fr })} · {intervention.heure}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {intervention.technicien}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-14">
            <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-7 h-7 text-text-muted" />
            </div>
            <p className="font-semibold text-text-muted">Aucune intervention</p>
            <p className="text-xs text-text-muted mt-1">Modifiez le filtre de statut</p>
          </div>
        )}
      </div>
    </div>
  );
}
