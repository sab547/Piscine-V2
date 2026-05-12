'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Calendar, Plus, Droplets, FileText, AlertTriangle } from 'lucide-react';

const mockMissions = [
  { id: '1', piscineNom: 'Résidence Les Pins', adresse: '12 allée des Pins, Antibes', heure: '09:00', status: 'PLANIFIE' },
  { id: '2', piscineNom: 'Villa Dupont', adresse: '5 rue des Oliviers, Nice', heure: '14:00', status: 'PLANIFIE' },
];

const statusLabel: Record<string, { label: string; cls: string }> = {
  PLANIFIE: { label: 'Planifiée', cls: 'bg-aqua-50 text-aqua-700' },
  EN_COURS: { label: 'En cours', cls: 'bg-warning-light text-warning' },
  COMPLETE: { label: 'Terminée', cls: 'bg-success-light text-success' },
};

export default function TechnicienPage() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const userRole = localStorage.getItem('user-role');
    const name = localStorage.getItem('user-name');

    if (!token || (userRole !== 'technicien' && userRole !== 'pisciniste')) {
      window.location.href = '/technicien/login';
      return;
    }

    setUserName(name || 'Technicien');
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Greeting */}
      <div>
        <p className="eyebrow">Sur le terrain</p>
        <h1 className="text-2xl font-display font-bold text-abyss mt-1">
          Bonjour, {userName.split(' ')[0]}
        </h1>
        <p className="text-sm text-text-muted capitalize mt-0.5">{today}</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/passage/nouveau"
          className="flex items-center gap-3 p-4 rounded-xl bg-gradient-ocean text-white shadow-ocean hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">Nouveau passage</p>
            <p className="text-xs text-white/70">Démarrer une intervention</p>
          </div>
        </Link>

        <Link
          href="/piscines"
          className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border shadow-sm hover:bg-aqua-50 transition"
        >
          <Droplets className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="font-semibold text-sm text-text">Mes piscines</p>
            <p className="text-xs text-text-muted">Voir la liste</p>
          </div>
        </Link>

        <Link
          href="/planning"
          className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border shadow-sm hover:bg-aqua-50 transition"
        >
          <Calendar className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="font-semibold text-sm text-text">Planning</p>
            <p className="text-xs text-text-muted">Voir le calendrier</p>
          </div>
        </Link>

        <Link
          href="/rapports"
          className="flex items-center gap-3 p-4 rounded-xl bg-surface border border-border shadow-sm hover:bg-aqua-50 transition"
        >
          <FileText className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="font-semibold text-sm text-text">Rapports</p>
            <p className="text-xs text-text-muted">Mes passages</p>
          </div>
        </Link>
      </div>

      {/* Today's missions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-text">Missions du jour</h2>
          <Link href="/planning" className="text-xs text-primary font-semibold hover:underline">
            Voir tout
          </Link>
        </div>

        {mockMissions.length === 0 ? (
          <div className="card-glass text-center py-10 text-text-muted text-sm">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-text-muted/40" />
            Aucune mission prévue aujourd'hui
          </div>
        ) : (
          <div className="space-y-3">
            {mockMissions.map((mission) => {
              const st = statusLabel[mission.status] ?? { label: mission.status, cls: 'bg-border text-text-muted' };
              return (
                <Link
                  key={mission.id}
                  href={`/passage/${mission.id}`}
                  className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border shadow-sm hover:border-primary/40 transition"
                >
                  <div className="w-9 h-9 rounded-lg bg-aqua-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-text truncate">{mission.piscineNom}</p>
                    <p className="text-xs text-text-muted truncate">{mission.adresse}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock className="w-3 h-3 text-text-muted" />
                      <span className="text-xs text-text-muted">{mission.heure}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
