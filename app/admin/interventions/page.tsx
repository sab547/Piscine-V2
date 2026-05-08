'use client';

import { Calendar, MapPin, Filter } from 'lucide-react';
import { useState } from 'react';
import { mockMissions, getStatusLabel, getStatusColor } from '@/lib/mock-data';

export default function AdminInterventionsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const interventions = mockMissions.map((mission, i) => ({
    id: mission.id,
    piscine: mission.client,
    adresse: mission.adresse,
    statut: mission.statut,
    heure: mission.heure,
    date: new Date(Date.now() + (i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
    technicien: 'Karim Benali',
  }));

  const filtered =
    statusFilter === 'all' ? interventions : interventions.filter((i) => i.statut === statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Toutes les interventions</h2>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-text-muted" />
        <div className="flex gap-2 flex-wrap">
          {['all', 'PLANIFIE', 'EN_COURS', 'COMPLETE', 'ANNULE'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text hover:border-primary'
              }`}
            >
              {status === 'all' ? 'Tous' : getStatusLabel(status as any)}
            </button>
          ))}
        </div>
      </div>

      {/* Interventions List */}
      <div className="space-y-3">
        {filtered.map((intervention) => (
          <div key={intervention.id} className="card flex items-start justify-between group hover:shadow-md transition-shadow">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-text">{intervention.piscine}</h3>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                    intervention.statut as any
                  )}`}
                >
                  {getStatusLabel(intervention.statut as any)}
                </span>
              </div>

              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-text-muted">
                  <MapPin className="w-4 h-4" />
                  {intervention.adresse}
                </div>
                <div className="flex items-center gap-2 text-text-muted">
                  <Calendar className="w-4 h-4" />
                  {intervention.date} à {intervention.heure}
                </div>
              </div>

              <p className="text-xs text-text-muted">Technicien: {intervention.technicien}</p>
            </div>

            <button className="px-4 py-2 btn-secondary text-sm opacity-0 group-hover:opacity-100 transition-opacity">
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
