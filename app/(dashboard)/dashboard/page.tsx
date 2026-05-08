'use client';

import { AlertCircle, Clock, MapPin, ChevronRight, Droplets, TrendingUp, FileCheck } from 'lucide-react';
import Link from 'next/link';
import { mockTechnicien, mockMissions, getStatusColor, getStatusLabel } from '@/lib/mock-data';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardPage() {
  const today = new Date();
  const todayFormatted = format(today, 'EEEE d MMMM', { locale: fr });
  const missionsCount = mockMissions.length;
  const completedCount = mockMissions.filter(m => m.statut === 'COMPLETE').length;

  return (
    <div className="pb-6 space-y-0">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary-dark text-white px-5 pt-6 pb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-white/70 mb-1">
              {todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1)}
            </p>
            <h1 className="text-2xl font-bold font-display">
              Bonjour, {mockTechnicien.prenom} 👋
            </h1>
          </div>
          <Link
            href="/anomalies"
            className="relative p-2 bg-white/15 rounded-xl active:bg-white/25 transition-colors"
          >
            <AlertCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-warning text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              2
            </span>
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold font-mono">{missionsCount}</p>
            <p className="text-[11px] text-white/70 mt-0.5">Missions</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold font-mono">{completedCount}</p>
            <p className="text-[11px] text-white/70 mt-0.5">Terminées</p>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold font-mono">2</p>
            <p className="text-[11px] text-white/70 mt-0.5">Alertes</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-6">
        {/* Anomaly Alert */}
        <Link
          href="/anomalies"
          className="flex items-center gap-3 bg-danger/8 border border-danger/20 rounded-xl p-4 active:bg-danger/15 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-danger/15 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-danger" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-danger">2 anomalies actives</p>
            <p className="text-xs text-danger/70 mt-0.5 truncate">
              Chlore hors norme · pH en alerte
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-danger/60 flex-shrink-0" />
        </Link>

        {/* Missions du jour */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text font-display">Missions du jour</h2>
            <Link href="/planning" className="text-xs font-semibold text-primary">
              Planning →
            </Link>
          </div>

          <div className="space-y-2.5">
            {mockMissions.map((mission) => (
              <Link
                key={mission.id}
                href={`/passage/${mission.id}`}
                className="flex items-center gap-3 bg-surface border border-border hover:border-primary active:border-primary rounded-xl p-4 transition-all group"
              >
                {/* Status dot */}
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  mission.statut === 'COMPLETE' ? 'bg-success' :
                  mission.statut === 'EN_COURS' ? 'bg-warning' :
                  'bg-primary/40'
                }`} />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-xs font-semibold text-primary">{mission.heure}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusColor(mission.statut)}`}>
                      {getStatusLabel(mission.statut)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-text truncate">{mission.client}</p>
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{mission.adresse}</span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary group-active:text-primary transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-text font-display">Accès rapide</h2>
          <div className="grid grid-cols-3 gap-3">
            <Link
              href="/piscines"
              className="flex flex-col items-center gap-2 bg-primary/6 border border-primary/15 rounded-xl p-4 active:bg-primary/12 transition-colors"
            >
              <div className="w-10 h-10 bg-primary/15 rounded-xl flex items-center justify-center">
                <Droplets className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary text-center leading-tight">Mes piscines</span>
            </Link>

            <Link
              href="/rapports"
              className="flex flex-col items-center gap-2 bg-success/6 border border-success/15 rounded-xl p-4 active:bg-success/12 transition-colors"
            >
              <div className="w-10 h-10 bg-success/15 rounded-xl flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-success" />
              </div>
              <span className="text-xs font-semibold text-success text-center leading-tight">Rapports</span>
            </Link>

            <Link
              href="/planning"
              className="flex flex-col items-center gap-2 bg-accent/6 border border-accent/15 rounded-xl p-4 active:bg-accent/12 transition-colors"
            >
              <div className="w-10 h-10 bg-accent/15 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xs font-semibold text-accent text-center leading-tight">Planning</span>
            </Link>
          </div>
        </div>

        {/* Weekly stats */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-text font-display">Cette semaine</h2>
          <div className="bg-surface border border-border rounded-xl divide-y divide-border">
            <StatRow icon="✅" label="Passages effectués" value="7" />
            <StatRow icon="📄" label="Rapports envoyés" value="7" />
            <StatRow icon="🤝" label="Contrats actifs" value="12" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-text">{label}</span>
      </div>
      <span className="text-lg font-bold text-text font-mono">{value}</span>
    </div>
  );
}
