'use client';

import { Users, Droplets, TrendingUp, AlertCircle, ArrowUpRight, Activity } from 'lucide-react';
import { mockPiscines, mockMissions } from '@/lib/mock-data';
import { StatutPassage } from '@/types';

function KpiCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number; sub: string;
  color: 'primary' | 'accent' | 'success' | 'warning';
}) {
  const bg = { primary: 'bg-primary/8', accent: 'bg-accent/8', success: 'bg-success/8', warning: 'bg-warning/8' };
  const text = { primary: 'text-primary', accent: 'text-accent', success: 'text-success', warning: 'text-warning' };
  return (
    <div className="bg-white border border-border/70 rounded-2xl p-5 shadow-[0_1px_4px_rgba(11,94,168,0.06)]">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${bg[color]} rounded-xl flex items-center justify-center`}>{icon}</div>
        <ArrowUpRight className={`w-4 h-4 ${text[color]} opacity-50`} />
      </div>
      <p className="text-3xl font-black font-mono text-text">{value}</p>
      <p className="text-sm font-semibold text-text mt-1">{label}</p>
      <p className="text-xs text-text-muted mt-0.5">{sub}</p>
    </div>
  );
}

function ProgressRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-text-muted w-40 flex-shrink-0">{label}</p>
      <div className="flex-1 h-2 bg-border/60 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-sm font-bold text-text w-10 text-right">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const piscineCount = mockPiscines.length;
  const passagesCount = mockMissions.length;
  const activeCount = mockMissions.filter(m => m.statut === StatutPassage.EN_COURS).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-text font-display">Tableau de bord</h2>
          <p className="text-sm text-text-muted mt-0.5">Vue d'ensemble de l'activité</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-success bg-success/10 px-3 py-1.5 rounded-full">
          <Activity className="w-3 h-3" /> Live
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={<Users className="w-5 h-5 text-primary" />} label="Clients actifs" value="1" sub="+0 ce mois" color="primary" />
        <KpiCard icon={<Droplets className="w-5 h-5 text-accent" />} label="Piscines gérées" value={piscineCount} sub="100% couverture" color="accent" />
        <KpiCard icon={<TrendingUp className="w-5 h-5 text-success" />} label="Passages ce mois" value={passagesCount} sub="En hausse" color="success" />
        <KpiCard icon={<AlertCircle className="w-5 h-5 text-warning" />} label="Anomalies actives" value="2" sub="À traiter" color="warning" />
      </div>

      {/* Recent activity + Stats side by side on large screens */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Activity */}
        <div className="bg-white border border-border/70 rounded-2xl shadow-[0_1px_4px_rgba(11,94,168,0.06)] overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50">
            <h3 className="font-bold text-text font-display">Activité récente</h3>
          </div>
          <div className="divide-y divide-border/40">
            {mockMissions.map((mission) => (
              <div key={mission.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface/50 transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  mission.statut === StatutPassage.EN_COURS ? 'bg-warning' :
                  mission.statut === StatutPassage.COMPLETE ? 'bg-success' : 'bg-border'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text truncate">{mission.client}</p>
                  <p className="text-xs text-text-muted">{mission.heure}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                  mission.statut === StatutPassage.EN_COURS ? 'bg-warning/10 text-warning' :
                  mission.statut === StatutPassage.COMPLETE ? 'bg-success/10 text-success' :
                  'bg-border text-text-muted'
                }`}>
                  {mission.statut === StatutPassage.EN_COURS ? 'En cours' :
                   mission.statut === StatutPassage.COMPLETE ? 'Terminé' : 'Prévu'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly stats */}
        <div className="bg-white border border-border/70 rounded-2xl shadow-[0_1px_4px_rgba(11,94,168,0.06)] overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50">
            <h3 className="font-bold text-text font-display">Performances du mois</h3>
          </div>
          <div className="px-5 py-5 space-y-4">
            <ProgressRow label="Passages complétés" value="75%" pct={75} color="bg-success" />
            <ProgressRow label="Anomalies traitées" value="50%" pct={50} color="bg-warning" />
            <ProgressRow label="Satisfaction clients" value="92%" pct={92} color="bg-primary" />
            <ProgressRow label="Rapports envoyés" value="88%" pct={88} color="bg-accent" />
          </div>
          <div className="px-5 pb-5 grid grid-cols-3 gap-3">
            {[
              { label: 'Techniciens', value: '1', color: 'text-primary' },
              { label: 'En cours', value: String(activeCount), color: 'text-warning' },
              { label: 'Taux', value: '95%', color: 'text-success' },
            ].map(s => (
              <div key={s.label} className="bg-surface rounded-xl p-3 text-center">
                <p className={`text-xl font-black font-mono ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
