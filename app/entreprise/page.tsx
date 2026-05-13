'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Droplets, Users, UserCheck, ListChecks, Calendar, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { mockMissions } from '@/lib/mock-data';
import { StatutPassage } from '@/types';

export default function EntreprisePage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const role = localStorage.getItem('user-role');
    const name = localStorage.getItem('user-name');
    if (!token || role !== 'pisciniste') { router.push('/login'); return; }
    setUserName(name || 'Entreprise');
    setLoading(false);
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );

  const enCours = mockMissions.filter(m => m.statut === StatutPassage.EN_COURS).length;
  const planifie = mockMissions.filter(m => m.statut === StatutPassage.PLANIFIE).length;
  const termine = mockMissions.filter(m => m.statut === StatutPassage.COMPLETE).length;

  const stats = [
    { label: 'Piscines gérées', value: 12, icon: Droplets, color: 'text-primary', bg: 'bg-primary/10', href: '/piscines' },
    { label: 'Techniciens actifs', value: 3, icon: Users, color: 'text-success', bg: 'bg-success/10', href: '/entreprise/techniciens' },
    { label: 'Missions en cours', value: enCours, icon: TrendingUp, color: 'text-warning', bg: 'bg-warning/10', href: '/entreprise/interventions' },
    { label: 'Alertes ouvertes', value: 2, icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10', href: '/entreprise/interventions' },
  ];

  const quickLinks = [
    { href: '/piscines', label: 'Piscines', desc: 'Gérer vos piscines et équipements', icon: Droplets, color: 'bg-primary' },
    { href: '/entreprise/techniciens', label: 'Techniciens', desc: 'Équipe, codes d\'accès et missions', icon: Users, color: 'bg-success' },
    { href: '/entreprise/clients', label: 'Clients', desc: 'Propriétaires et portails', icon: UserCheck, color: 'bg-aqua-600' },
    { href: '/entreprise/interventions', label: 'Interventions', desc: 'Suivi de tous les passages', icon: ListChecks, color: 'bg-warning' },
    { href: '/planning', label: 'Planning', desc: 'Calendrier des interventions', icon: Calendar, color: 'bg-lagoon' },
    { href: '/rapports', label: 'Rapports', desc: 'Télécharger les rapports PDF', icon: FileText, color: 'bg-abyss' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold font-display text-text">Tableau de bord</h1>
        <p className="text-text-muted text-sm mt-1">Bienvenue, {userName}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="card flex items-center gap-3 !p-4 hover:border-primary/40 hover:shadow-sm transition-all">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-text-muted leading-tight">{s.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">Gestion</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="card hover:border-primary transition-all group !p-4 flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${link.color} text-white group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text">{link.label}</p>
                  <p className="text-xs text-text-muted mt-0.5 leading-snug">{link.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Today's missions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted">Missions du jour</h2>
          <Link href="/entreprise/interventions" className="text-xs text-primary font-semibold hover:underline">
            Voir tout →
          </Link>
        </div>
        <div className="space-y-2">
          {mockMissions.slice(0, 3).map((m) => (
            <div key={m.id} className="card !p-3 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-text truncate">{m.client}</p>
                <p className="text-xs text-text-muted">{m.heure} · {m.adresse}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                m.statut === StatutPassage.COMPLETE ? 'bg-success/15 text-success' :
                m.statut === StatutPassage.EN_COURS ? 'bg-warning/15 text-warning' :
                'bg-border text-text-muted'
              }`}>
                {m.statut === StatutPassage.COMPLETE ? 'Terminé' :
                 m.statut === StatutPassage.EN_COURS ? 'En cours' : 'Prévu'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
