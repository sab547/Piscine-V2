'use client';

import { Calendar, MapPin, Filter, Plus } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockMissions, getStatusLabel, getStatusColor } from '@/lib/mock-data';
import { StatutPassage } from '@/types';

export default function EntrepriseInterventionsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const interventions = mockMissions.map((mission, i) => ({
    id: mission.id,
    piscine: mission.client,
    adresse: mission.adresse,
    statut: mission.statut,
    heure: mission.heure,
    date: new Date(mission.datePrevu).toLocaleDateString('fr-FR'),
    technicien: 'Karim Benali',
  }));

  const filtered = statusFilter === 'all'
    ? interventions
    : interventions.filter(i => i.statut === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Interventions</h2>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Planifier
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-text-muted shrink-0" />
        {(['all', 'PLANIFIE', 'EN_COURS', 'COMPLETE', 'ANNULE'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${
              statusFilter === status
                ? 'bg-primary text-white'
                : 'bg-surface border border-border text-text hover:border-primary'
            }`}
          >
            {status === 'all' ? 'Toutes' : getStatusLabel(status as StatutPassage)}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-sm text-text-muted font-semibold">
        {filtered.length} intervention{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((intervention) => (
          <div
            key={intervention.id}
            className="card flex items-start justify-between group hover:border-primary transition-all"
          >
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-text">{intervention.piscine}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getStatusColor(intervention.statut as StatutPassage)}`}>
                  {getStatusLabel(intervention.statut as StatutPassage)}
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-text-muted">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="truncate">{intervention.adresse}</span>
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  <Calendar className="w-4 h-4 shrink-0" />
                  {intervention.date} à {intervention.heure}
                </div>
              </div>
              <p className="text-xs text-text-muted">Technicien : <span className="font-semibold text-text">{intervention.technicien}</span></p>
            </div>

            <button
              onClick={() => router.push(`/passage/${intervention.id}`)}
              className="ml-3 px-3 py-1.5 btn-secondary text-sm shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Détails
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p>Aucune intervention trouvée</p>
        </div>
      )}
    </div>
  );
}
