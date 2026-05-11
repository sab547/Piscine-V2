'use client';

import { Clock, Star, Briefcase, CheckCircle2, TrendingUp, Edit3 } from 'lucide-react';
import { mockTechnicien, mockMissions } from '@/lib/mock-data';
import { StatutPassage } from '@/types';

export default function AdminTechniciensPage() {
  const techniciens = [{
    id: mockTechnicien.id,
    prenom: mockTechnicien.prenom,
    nom: mockTechnicien.nom,
    email: mockTechnicien.email,
    missions: mockMissions.filter(m => m.statut === StatutPassage.EN_COURS).length,
    terminees: mockMissions.filter(m => m.statut === StatutPassage.COMPLETE).length,
    performance: 92,
    statut: 'actif',
    derniereActivite: '8 mai 2026 · 13h45',
    specialite: 'Traitement eau chlore',
  }];

  const totalMissions = techniciens.reduce((a, b) => a + b.missions, 0);
  const avgPerf = Math.round(techniciens.reduce((a, b) => a + b.performance, 0) / techniciens.length);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-text font-display">Techniciens</h2>
          <p className="text-sm text-text-muted mt-0.5">{techniciens.length} technicien{techniciens.length > 1 ? 's' : ''} actif{techniciens.length > 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary text-sm py-2.5 px-4">+ Ajouter</button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Actifs', value: techniciens.length, color: 'text-primary', bg: 'bg-primary/8' },
          { label: 'En cours', value: totalMissions, color: 'text-warning', bg: 'bg-warning/8' },
          { label: 'Performance', value: `${avgPerf}%`, color: 'text-success', bg: 'bg-success/8' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
            <p className={`text-2xl font-black font-mono ${s.color}`}>{s.value}</p>
            <p className="text-xs font-semibold text-text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Technicien cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {techniciens.map((tech) => (
          <div key={tech.id} className="bg-white border border-border/70 rounded-2xl shadow-[0_1px_4px_rgba(11,94,168,0.06)] overflow-hidden hover:shadow-ocean-sm hover:border-primary/20 transition-all">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 px-5 pt-5 pb-4 border-b border-border/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-xl font-black text-white font-display shadow-ocean-sm">
                    {tech.prenom[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-text">{tech.prenom} {tech.nom}</h3>
                    <p className="text-xs text-text-muted">{tech.email}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${tech.statut === 'actif' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {tech.statut === 'actif' ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-xs text-text-muted flex items-center gap-1.5">
                <Star className="w-3 h-3 text-warning" /> {tech.specialite}
              </p>
            </div>

            {/* Stats */}
            <div className="px-5 py-4 grid grid-cols-2 gap-3">
              <div className="bg-surface rounded-xl p-3 text-center">
                <p className="text-2xl font-black font-mono text-primary">{tech.missions}</p>
                <p className="text-[10px] text-text-muted mt-1 flex items-center justify-center gap-1">
                  <Briefcase className="w-3 h-3" /> En cours
                </p>
              </div>
              <div className="bg-surface rounded-xl p-3 text-center">
                <p className="text-2xl font-black font-mono text-success">{tech.performance}%</p>
                <p className="text-[10px] text-text-muted mt-1 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Performance
                </p>
              </div>
            </div>

            {/* Activity */}
            <div className="px-5 pb-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                Dernière activité : <span className="font-semibold text-text">{tech.derniereActivite}</span>
              </div>

              {/* Performance bar */}
              <div>
                <div className="flex justify-between text-[10px] font-semibold text-text-muted mb-1">
                  <span>Performance globale</span><span>{tech.performance}%</span>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-700" style={{ width: `${tech.performance}%` }} />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-border/50">
                <button className="flex-1 btn-primary text-xs py-2.5">
                  <Briefcase className="w-3.5 h-3.5" /> Missions
                </button>
                <button className="flex items-center gap-1 btn-secondary text-xs py-2.5 px-3">
                  <Edit3 className="w-3.5 h-3.5" /> Éditer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
