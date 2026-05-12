'use client';

import { useState } from 'react';
import { Users, Clock, Plus, X, Eye, EyeOff, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { mockTechnicien, mockMissions } from '@/lib/mock-data';
import { StatutPassage } from '@/types';

interface Technicien {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  code: string;
  statut: 'actif' | 'inactif';
  missions: number;
  derniereActivite: string;
}

const INITIAL_TECHS: Technicien[] = [
  {
    id: mockTechnicien.id,
    prenom: mockTechnicien.prenom,
    nom: mockTechnicien.nom,
    email: mockTechnicien.email,
    code: 'TECH-4892',
    statut: 'actif',
    missions: mockMissions.filter(m => m.statut === StatutPassage.EN_COURS).length,
    derniereActivite: '2026-05-12 08:30',
  },
  {
    id: 'tech_002',
    prenom: 'Lucas',
    nom: 'Moreau',
    email: 'lucas.moreau@pooltrack.fr',
    code: 'TECH-7731',
    statut: 'actif',
    missions: 1,
    derniereActivite: '2026-05-11 14:00',
  },
];

type ModalType = 'add' | 'edit' | 'code' | null;

function TechModal({ tech, onClose, onSave }: {
  tech?: Technicien;
  onClose: () => void;
  onSave: (t: Partial<Technicien>) => void;
}) {
  const [prenom, setPrenom] = useState(tech?.prenom ?? '');
  const [nom, setNom] = useState(tech?.nom ?? '');
  const [email, setEmail] = useState(tech?.email ?? '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ prenom, nom, email });
    setSaved(true);
    setTimeout(onClose, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-text font-display">
            {tech ? 'Modifier le technicien' : 'Nouveau technicien'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {saved ? (
          <div className="flex items-center gap-2 text-success py-4">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Enregistré !</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Prénom</label>
                <input value={prenom} onChange={e => setPrenom(e.target.value)} required className="input-base" placeholder="Prénom" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Nom</label>
                <input value={nom} onChange={e => setNom(e.target.value)} required className="input-base" placeholder="Nom" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-base" placeholder="email@exemple.com" />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} className="flex-1 btn-secondary">Annuler</button>
              <button type="submit" className="flex-1 btn-primary">Enregistrer</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function CodeModal({ tech, onClose }: { tech: Technicien; onClose: () => void }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(tech.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-text font-display">Code d'accès</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>
        <p className="text-sm text-text-muted">
          Partagez ce code avec <strong>{tech.prenom} {tech.nom}</strong> pour qu'il accède à l'espace technicien.
        </p>
        <div className="bg-surface rounded-xl p-4 flex items-center justify-between gap-3">
          <span className="font-mono text-xl font-bold text-primary tracking-widest">
            {show ? tech.code : '••••••••••'}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setShow(!show)} className="p-2 hover:bg-border rounded-lg transition-colors">
              {show ? <EyeOff className="w-4 h-4 text-text-muted" /> : <Eye className="w-4 h-4 text-text-muted" />}
            </button>
            <button onClick={copy} className="p-2 hover:bg-border rounded-lg transition-colors">
              {copied ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-text-muted" />}
            </button>
          </div>
        </div>
        <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
          <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-warning">Ce code permet l'accès à l'espace technicien. Ne le partagez qu'avec les personnes autorisées.</p>
        </div>
      </div>
    </div>
  );
}

export default function EntrepriseTechniciensPage() {
  const [techs, setTechs] = useState<Technicien[]>(INITIAL_TECHS);
  const [modal, setModal] = useState<ModalType>(null);
  const [selected, setSelected] = useState<Technicien | null>(null);

  const openAdd = () => { setSelected(null); setModal('add'); };
  const openEdit = (t: Technicien) => { setSelected(t); setModal('edit'); };
  const openCode = (t: Technicien) => { setSelected(t); setModal('code'); };
  const close = () => { setModal(null); setSelected(null); };

  const handleSave = (data: Partial<Technicien>) => {
    if (selected) {
      setTechs(prev => prev.map(t => t.id === selected.id ? { ...t, ...data } : t));
    } else {
      const newTech: Technicien = {
        id: `tech_${Date.now()}`,
        prenom: data.prenom ?? '',
        nom: data.nom ?? '',
        email: data.email ?? '',
        code: `TECH-${Math.floor(1000 + Math.random() * 9000)}`,
        statut: 'actif',
        missions: 0,
        derniereActivite: 'Jamais',
      };
      setTechs(prev => [...prev, newTech]);
    }
  };

  const totalMissions = techs.reduce((s, t) => s + t.missions, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Mes techniciens</h2>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Actifs', value: techs.filter(t => t.statut === 'actif').length, color: 'text-success' },
          { label: 'Missions', value: totalMissions, color: 'text-warning' },
          { label: 'Taux', value: '95%', color: 'text-primary' },
        ].map(s => (
          <div key={s.label} className="card text-center !p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Technician cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {techs.map((tech) => (
          <div key={tech.id} className="card space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-text">{tech.prenom} {tech.nom}</h3>
                <p className="text-xs text-text-muted">{tech.email}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                tech.statut === 'actif' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
              }`}>
                {tech.statut === 'actif' ? 'Actif' : 'Inactif'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-primary">{tech.missions}</p>
                <p className="text-xs text-text-muted">Mission(s) en cours</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-primary">92%</p>
                <p className="text-xs text-text-muted">Performance</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Clock className="w-3.5 h-3.5" />
              Dernière activité : {tech.derniereActivite}
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <Link href="/entreprise/interventions" className="flex-1 btn-primary text-sm text-center">
                Missions
              </Link>
              <button onClick={() => openCode(tech)} className="flex-1 btn-secondary text-sm">
                Code accès
              </button>
              <button onClick={() => openEdit(tech)} className="px-3 btn-secondary text-sm">
                Éditer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {(modal === 'add' || modal === 'edit') && (
        <TechModal tech={selected ?? undefined} onClose={close} onSave={handleSave} />
      )}
      {modal === 'code' && selected && (
        <CodeModal tech={selected} onClose={close} />
      )}
    </div>
  );
}
