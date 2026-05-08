'use client';

import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { mockTechnicien, mockMissions } from '@/lib/mock-data';

export default function AdminTechniciensPage() {
  const techniciens = [
    {
      id: mockTechnicien.id,
      nom: `${mockTechnicien.prenom} ${mockTechnicien.nom}`,
      email: mockTechnicien.email,
      missions: mockMissions.filter((m) => m.statut === 'EN_COURS').length,
      statut: 'actif',
      derniereActivite: '2026-05-08 13:45',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Gestion des techniciens</h2>
      </div>

      {/* Techniciens Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {techniciens.map((tech) => (
          <div key={tech.id} className="card space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-text text-lg">{tech.nom}</h3>
                <p className="text-xs text-text-muted">{tech.email}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  tech.statut === 'actif'
                    ? 'bg-success/20 text-success'
                    : 'bg-warning/20 text-warning'
                }`}
              >
                {tech.statut === 'actif' ? 'Actif' : 'Inactif'}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">{tech.missions}</p>
                <p className="text-xs text-text-muted mt-1">Mission(s)</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">92%</p>
                <p className="text-xs text-text-muted mt-1">Performance</p>
              </div>
            </div>

            {/* Activity */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-text-muted">
                <Clock className="w-4 h-4" />
                {tech.derniereActivite}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <button className="flex-1 btn-primary text-sm">Voir missions</button>
              <button className="flex-1 btn-secondary text-sm">Éditer</button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="card">
        <h3 className="font-bold text-lg text-text font-display mb-4">Résumé des performances</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-3xl font-bold text-primary">{techniciens.length}</p>
            <p className="text-xs text-text-muted mt-2">Techniciens actifs</p>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-3xl font-bold text-success">{techniciens.reduce((a, b) => a + b.missions, 0)}</p>
            <p className="text-xs text-text-muted mt-2">Missions en cours</p>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-3xl font-bold text-warning">95%</p>
            <p className="text-xs text-text-muted mt-2">Taux de complétion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
