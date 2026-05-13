'use client';

import { useState } from 'react';
import { Users, Clock, Plus, X, Eye, EyeOff, Copy, CheckCircle2, AlertCircle, KeyRound, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { mockTechnicien, mockMissions } from '@/lib/mock-data';
import { StatutPassage } from '@/types';

interface Technicien {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  password: string;
  statut: 'actif' | 'inactif';
  missions: number;
  derniereActivite: string;
}

function generatePassword() {
  const words = ['piscine', 'pool', 'bleu', 'eau', 'tech'];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${word}${num}`;
}

const INITIAL_TECHS: Technicien[] = [
  {
    id: mockTechnicien.id,
    prenom: mockTechnicien.prenom,
    nom: mockTechnicien.nom,
    email: 'technicien@example.com',
    password: 'password123',
    statut: 'actif',
    missions: mockMissions.filter(m => m.statut === StatutPassage.EN_COURS).length,
    derniereActivite: '2026-05-12 08:30',
  },
  {
    id: 'tech_002',
    prenom: 'Lucas',
    nom: 'Moreau',
    email: 'lucas.moreau@pooltrack.fr',
    password: 'password123',
    statut: 'actif',
    missions: 1,
    derniereActivite: '2026-05-11 14:00',
  },
];

type ModalType = 'add' | 'edit' | 'credentials' | null;

function TechModal({ tech, onClose, onSave }: {
  tech?: Technicien;
  onClose: () => void;
  onSave: (t: Partial<Technicien>) => void;
}) {
  const [prenom, setPrenom] = useState(tech?.prenom ?? '');
  const [nom, setNom] = useState(tech?.nom ?? '');
  const [email, setEmail] = useState(tech?.email ?? '');
  const [password, setPassword] = useState(tech?.password ?? generatePassword());
  const [showPwd, setShowPwd] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ prenom, nom, email, password });
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
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Email de connexion</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-base" placeholder="prenom.nom@exemple.com" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">Mot de passe</label>
                <button
                  type="button"
                  onClick={() => setPassword(generatePassword())}
                  className="text-xs text-primary flex items-center gap-1 hover:underline"
                >
                  <RefreshCw className="w-3 h-3" /> Générer
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="input-base pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-text-muted mt-1">Partagez ces identifiants au technicien pour qu'il se connecte.</p>
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

function CredentialsModal({ tech, onClose, onResetPassword }: {
  tech: Technicien;
  onClose: () => void;
  onResetPassword: (id: string, pwd: string) => void;
}) {
  const [showPwd, setShowPwd] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPwd, setCopiedPwd] = useState(false);

  const copy = (text: string, setFlag: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setFlag(true);
    setTimeout(() => setFlag(false), 2000);
  };

  const handleReset = () => {
    const newPwd = generatePassword();
    onResetPassword(tech.id, newPwd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg text-text font-display">Identifiants</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <p className="text-sm text-text-muted">
          Identifiants de connexion de <strong>{tech.prenom} {tech.nom}</strong> pour l'espace technicien.
        </p>

        <div className="space-y-2">
          <div className="bg-surface rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Email</p>
              <p className="font-mono text-sm text-text truncate">{tech.email}</p>
            </div>
            <button onClick={() => copy(tech.email, setCopiedEmail)} className="p-2 hover:bg-border rounded-lg transition-colors shrink-0">
              {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-text-muted" />}
            </button>
          </div>

          <div className="bg-surface rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Mot de passe</p>
              <p className="font-mono text-sm text-text">
                {showPwd ? tech.password : '••••••••'}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setShowPwd(!showPwd)} className="p-2 hover:bg-border rounded-lg transition-colors">
                {showPwd ? <EyeOff className="w-4 h-4 text-text-muted" /> : <Eye className="w-4 h-4 text-text-muted" />}
              </button>
              <button onClick={() => copy(tech.password, setCopiedPwd)} className="p-2 hover:bg-border rounded-lg transition-colors">
                {copiedPwd ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-text-muted" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
          <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-warning">Ne partagez ces identifiants qu'avec le technicien concerné.</p>
        </div>

        <button
          onClick={handleReset}
          className="w-full btn-secondary text-sm flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Réinitialiser le mot de passe
        </button>
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
  const openCredentials = (t: Technicien) => { setSelected(t); setModal('credentials'); };
  const close = () => { setModal(null); setSelected(null); };

  const handleSave = (data: Partial<Technicien>) => {
    if (selected) {
      setTechs(prev => prev.map(t => t.id === selected.id ? { ...t, ...data } : t));
    } else {
      setTechs(prev => [...prev, {
        id: `tech_${Date.now()}`,
        prenom: data.prenom ?? '',
        nom: data.nom ?? '',
        email: data.email ?? '',
        password: data.password ?? generatePassword(),
        statut: 'actif',
        missions: 0,
        derniereActivite: 'Jamais',
      }]);
    }
  };

  const handleResetPassword = (id: string, pwd: string) => {
    setTechs(prev => prev.map(t => t.id === id ? { ...t, password: pwd } : t));
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
              <button onClick={() => openCredentials(tech)} className="flex-1 btn-secondary text-sm flex items-center justify-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                Identifiants
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
      {modal === 'credentials' && selected && (
        <CredentialsModal tech={selected} onClose={close} onResetPassword={handleResetPassword} />
      )}
    </div>
  );
}
