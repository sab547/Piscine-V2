'use client';

import { Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { mockAllTechniciens } from '@/lib/mock-data';

export default function AdminTechniciensPage() {
  const actifs = mockAllTechniciens.filter(t => t.statut === 'actif').length;
  const totalMissions = mockAllTechniciens.reduce((s, t) => s + t.missions, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Tous les techniciens</h2>
        <p className="text-sm text-text-muted mt-1">{mockAllTechniciens.length} technicien{mockAllTechniciens.length > 1 ? 's' : ''} sur la plateforme</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAllTechniciens.map((tech) => (
          <div key={tech.id} className="card space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-text">{tech.prenom} {tech.nom}</h3>
                <p className="text-xs text-text-muted">{tech.email}</p>
                <p className="text-xs text-primary font-medium mt-0.5">{tech.entreprise}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                tech.statut === 'actif' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
              }`}>
                {tech.statut}
              </span>
            </div>

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

            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Clock className="w-3.5 h-3.5" />
              {tech.derniereActivite}
            </div>

            <div className="pt-2 border-t border-border">
              <Link href="/admin/interventions" className="w-full btn-primary text-sm text-center block">
                Voir missions
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-bold text-lg text-text font-display mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Résumé plateforme
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-3xl font-bold text-primary">{actifs}</p>
            <p className="text-xs text-text-muted mt-2">Techniciens actifs</p>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-3xl font-bold text-success">{totalMissions}</p>
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
