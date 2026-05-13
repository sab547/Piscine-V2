'use client';

import { AlertCircle, Clock, MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockTechnicien, mockMissions, getStatusColor, getStatusLabel } from '@/lib/mock-data';
import { StatutPassage } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function DashboardPage() {
  const router = useRouter();
  const today = new Date();
  const todayFormatted = format(today, 'EEEE d MMMM', { locale: fr });
  const missionsCount = mockMissions.length;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Hero Card */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg p-6 space-y-2">
        <p className="text-sm font-semibold text-white/80">Bonjour</p>
        <h1 className="text-3xl font-bold font-display">
          {mockTechnicien.prenom} 👋
        </h1>
        <p className="text-sm text-white/70 mt-3">
          {todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1)}
        </p>
        <div className="text-sm font-semibold mt-4 bg-white/20 rounded-lg px-3 py-2 inline-block">
          {missionsCount} missions aujourd'hui
        </div>
      </div>

      {/* Alert Banner (conditional) */}
      <div className="bg-warning/10 border border-warning rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-warning">
            1 anomalie active
          </p>
          <p className="text-xs text-warning/80 mt-1">
            Résidence Les Pins — pH en alerte
          </p>
          <button
            onClick={() => router.push('/anomalies')}
            className="text-xs font-semibold text-warning hover:text-warning/80 mt-2"
          >
            Voir →
          </button>
        </div>
      </div>

      {/* Missions List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text font-display">
          Missions du jour
        </h2>

        {mockMissions.map((mission) => (
          <Link
            key={mission.id}
            href={`/passage/${mission.id}`}
            className="block bg-surface border border-border hover:border-primary hover:shadow-sm rounded-lg p-4 transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-text">
                    {mission.heure}
                  </p>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
                      mission.statut
                    )}`}
                  >
                    {getStatusLabel(mission.statut)}
                  </span>
                </div>

                <p className="text-base font-semibold text-text">
                  {mission.client}
                </p>

                <div className="flex items-center gap-1 text-xs text-text-muted">
                  <MapPin className="w-3 h-3" />
                  {mission.adresse}
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-text font-display">
          Statistiques cette semaine
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Terminés" value={String(mockMissions.filter(m => m.statut === StatutPassage.COMPLETE).length)} icon="✓" />
          <StatCard label="Planifiés" value={String(mockMissions.filter(m => m.statut === StatutPassage.PLANIFIE).length)} icon="📅" />
          <StatCard label="En cours" value={String(mockMissions.filter(m => m.statut === StatutPassage.EN_COURS).length)} icon="⚡" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 text-center space-y-2">
      <p className="text-2xl">{icon}</p>
      <p className="text-2xl font-bold text-text font-mono">{value}</p>
      <p className="text-xs font-semibold text-text-muted">{label}</p>
    </div>
  );
}
