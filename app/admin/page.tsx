'use client';

import { Users, Droplets, TrendingUp, AlertCircle } from 'lucide-react';
import { mockProprietaire, mockPiscines, mockMissions } from '@/lib/mock-data';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  color: 'primary' | 'accent' | 'success' | 'warning';
}

function StatCard({ icon, label, value, change, color }: StatCardProps) {
  const colorMap = {
    primary: 'bg-primary/10 border-primary',
    accent: 'bg-accent/10 border-accent',
    success: 'bg-success/10 border-success',
    warning: 'bg-warning/10 border-warning',
  };

  return (
    <div className={`stat-card border-l-4 border-${color}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-muted font-body">{label}</p>
          <p className="text-3xl font-bold text-text font-display mt-2">{value}</p>
          {change && <p className="text-xs text-text-muted mt-1">{change}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>{icon}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const clientCount = 1; // mockProprietaire count
  const piscineCount = mockPiscines.length;
  const passagesThisMonth = mockMissions.length;
  const anomaliesActive = 2; // Mock value

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Tableau de bord</h2>
      </div>

      {/* KPI Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6 text-primary" />}
          label="Clients actifs"
          value={clientCount}
          change="+0 ce mois"
          color="primary"
        />
        <StatCard
          icon={<Droplets className="w-6 h-6 text-accent" />}
          label="Piscines gérées"
          value={piscineCount}
          change="100% couverture"
          color="accent"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-success" />}
          label="Passages ce mois"
          value={passagesThisMonth}
          change="→ trending up"
          color="success"
        />
        <StatCard
          icon={<AlertCircle className="w-6 h-6 text-warning" />}
          label="Anomalies actives"
          value={anomaliesActive}
          change="2 en cours"
          color="warning"
        />
      </div>

      {/* Activity Section */}
      <div className="card space-y-4">
        <h3 className="font-bold text-lg text-text font-display">Dernier activité</h3>
        <div className="space-y-3">
          {mockMissions.slice(0, 5).map((mission, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-surface rounded-lg hover:bg-border transition-colors"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm text-text">{mission.client}</p>
                <p className="text-xs text-text-muted">{mission.heure}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                mission.statut === 'EN_COURS'
                  ? 'bg-warning/20 text-warning'
                  : 'bg-primary/20 text-primary'
              }`}>
                {mission.statut === 'EN_COURS' ? 'En cours' : 'Planifiée'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="card space-y-4">
        <h3 className="font-bold text-lg text-text font-display">Statistiques mensuelles</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Passages complétés</span>
            <div className="w-24 h-2 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-success w-3/4" />
            </div>
            <span className="text-sm font-semibold text-text">75%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Anomalies traitées</span>
            <div className="w-24 h-2 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-warning w-1/2" />
            </div>
            <span className="text-sm font-semibold text-text">50%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-muted">Satisfaction clients</span>
            <div className="w-24 h-2 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-success w-5/6" />
            </div>
            <span className="text-sm font-semibold text-text">92%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
