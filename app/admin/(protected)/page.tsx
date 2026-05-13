'use client';

import Link from 'next/link';
import { Users, Droplets, Wrench, ListChecks, Settings, TrendingUp, ShieldCheck } from 'lucide-react';
import { mockEntreprises, mockAllTechniciens, mockMissions, mockPiscines } from '@/lib/mock-data';

const nbEntreprises = mockEntreprises.length;
const nbTechniciens = mockAllTechniciens.length;
const nbInterventions = mockMissions.length;
const nbPiscines = mockPiscines.length;

const stats = [
  { label: 'Entreprises', value: nbEntreprises, icon: Users, color: 'text-primary', bg: 'bg-primary/10', href: '/admin/clients' },
  { label: 'Techniciens', value: nbTechniciens, icon: Wrench, color: 'text-success', bg: 'bg-success/10', href: '/admin/techniciens' },
  { label: 'Interventions', value: nbInterventions, icon: ListChecks, color: 'text-warning', bg: 'bg-warning/10', href: '/admin/interventions' },
  { label: 'Piscines gérées', value: nbPiscines, icon: Droplets, color: 'text-aqua-600', bg: 'bg-aqua-50', href: '/admin/piscines' },
];

const sections = [
  {
    href: '/admin/clients',
    label: 'Entreprises',
    desc: 'Gérer les comptes piscinistes abonnés à la plateforme',
    icon: Users,
    color: 'bg-primary',
  },
  {
    href: '/admin/techniciens',
    label: 'Techniciens',
    desc: 'Superviser les techniciens de toutes les entreprises',
    icon: Wrench,
    color: 'bg-success',
  },
  {
    href: '/admin/piscines',
    label: 'Piscines',
    desc: 'Toutes les piscines enregistrées sur la plateforme',
    icon: Droplets,
    color: 'bg-aqua-600',
  },
  {
    href: '/admin/interventions',
    label: 'Interventions',
    desc: 'Historique global de tous les passages enregistrés',
    icon: ListChecks,
    color: 'bg-warning',
  },
  {
    href: '/admin/cache',
    label: 'Paramètres système',
    desc: 'Configuration et maintenance de la plateforme',
    icon: Settings,
    color: 'bg-abyss',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-abyss text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-abyss">Tableau de bord</h1>
          <p className="text-sm text-text-muted">Vue plateforme · Accès administrateur</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="card flex items-center gap-3 !p-4 hover:border-primary/40 hover:shadow-sm transition-all"
            >
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

      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">Gestion</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="card hover:border-primary/40 transition-all group !p-4 flex items-start gap-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color} text-white group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text">{s.label}</p>
                  <p className="text-xs text-text-muted mt-0.5 leading-snug">{s.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-abyss/5 border border-abyss/10">
        <TrendingUp className="w-5 h-5 text-abyss shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-abyss">Espace privé — plateforme PoolTrack</p>
          <p className="text-text-muted mt-0.5">Toutes les actions sont enregistrées. Cet espace n'est pas accessible aux entreprises clientes.</p>
        </div>
      </div>
    </div>
  );
}
