'use client';

import { useState } from 'react';
import { Clock, Users, X, Eye, EyeOff, Copy, CheckCircle2, AlertCircle, KeyRound, RefreshCw, Plus } from 'lucide-react';
import Link from 'next/link';
import { mockAllTechniciens, mockEntreprises } from '@/lib/mock-data';

type Tech = typeof mockAllTechniciens[0] & { password: string };

function generatePassword() {
  const words = ['piscine', 'pool', 'bleu', 'eau', 'tech'];
  return `${words[Math.floor(Math.random() * words.length)]}${Math.floor(100 + Math.random() * 900)}`;
}

function EditModal({ tech, onClose, onSave }: {
  tech: Tech;
  onClose: () => void;
  onSave: (data: Partial<Tech>) => void;
}) {
  const [prenom, setPrenom] = useState(tech.prenom);
  const [nom, setNom] = useState(tech.nom);
  const [email, setEmail] = useState(tech.email);
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
          <h2 className="font-bold text-lg text-text font-display">Modifier le technicien</h2>
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
                <input value={prenom} onChange={e => setPrenom(e.target.value)} required className="input-base" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Nom</label>
                <input value={nom} onChange={e => setNom(e.target.value)} required className="input-base" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-base" />
            </div>
            <p className="text-xs text-text-muted flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-warning shrink-0" />
              Entreprise : {tech.entreprise}
            </p>
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
  tech: Tech;
  onClose: () => void;
  onResetPassword: (id: string, pwd: string) => void;
}) {
  const [showPwd, setShowPwd] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPwd, setCopiedPwd] = useState(false);

  const copy = (text: string, set: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    set(true);
    setTimeout(() => set(false), 2000);
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
          Identifiants de <strong>{tech.prenom} {tech.nom}</strong> — {tech.entreprise}
        </p>

        <div className="space-y-2">
          <div className="bg-surface rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Email</p>
              <p className="font-mono text-sm text-text truncate">{tech.email}</p>
            </div>
            <button onClick={() => copy(tech.email, setCopiedEmail)} className="p-2 hover:bg-border rounded-lg shrink-0">
              {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-text-muted" />}
            </button>
          </div>
          <div className="bg-surface rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">Mot de passe</p>
              <p className="font-mono text-sm text-text">{showPwd ? tech.password : '••••••••'}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => setShowPwd(!showPwd)} className="p-2 hover:bg-border rounded-lg">
                {showPwd ? <EyeOff className="w-4 h-4 text-text-muted" /> : <Eye className="w-4 h-4 text-text-muted" />}
              </button>
              <button onClick={() => copy(tech.password, setCopiedPwd)} className="p-2 hover:bg-border rounded-lg">
                {copiedPwd ? <CheckCircle2 className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-text-muted" />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => { onResetPassword(tech.id, generatePassword()); onClose(); }}
          className="w-full btn-secondary text-sm flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Réinitialiser le mot de passe
        </button>
      </div>
    </div>
  );
}

function AddTechModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (t: Omit<Tech, 'id' | 'statut' | 'missions' | 'derniereActivite'>) => void;
}) {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [entreprise, setEntreprise] = useState(mockEntreprises[0]?.nom ?? '');
  const [password, setPassword] = useState(generatePassword());
  const [showPwd, setShowPwd] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ prenom, nom, email, entreprise, password });
    setSaved(true);
    setTimeout(onClose, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-text font-display">Nouveau technicien</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg"><X className="w-5 h-5 text-text-muted" /></button>
        </div>
        {saved ? (
          <div className="flex items-center gap-2 text-success py-4"><CheckCircle2 className="w-5 h-5" /><span className="font-semibold">Technicien créé !</span></div>
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
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-base" placeholder="prenom.nom@exemple.com" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Entreprise</label>
              <select value={entreprise} onChange={e => setEntreprise(e.target.value)} className="input-base">
                {mockEntreprises.map(e => <option key={e.id} value={e.nom}>{e.nom}</option>)}
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted">Mot de passe</label>
                <button type="button" onClick={() => setPassword(generatePassword())} className="text-xs text-primary flex items-center gap-1 hover:underline">
                  <RefreshCw className="w-3 h-3" /> Générer
                </button>
              </div>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="input-base pr-10" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={onClose} className="flex-1 btn-secondary">Annuler</button>
              <button type="submit" className="flex-1 btn-primary">Créer</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AdminTechniciensPage() {
  const [techs, setTechs] = useState<Tech[]>(
    mockAllTechniciens.map(t => ({ ...t, password: 'password123' }))
  );
  const [editTech, setEditTech] = useState<Tech | null>(null);
  const [credTech, setCredTech] = useState<Tech | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const handleSave = (data: Partial<Tech>) => {
    if (!editTech) return;
    setTechs(prev => prev.map(t => t.id === editTech.id ? { ...t, ...data } : t));
  };

  const handleAdd = (data: Omit<Tech, 'id' | 'statut' | 'missions' | 'derniereActivite'>) => {
    setTechs(prev => [...prev, {
      id: `tech_${Date.now()}`,
      statut: 'actif' as const,
      missions: 0,
      derniereActivite: 'Jamais',
      ...data,
    }]);
  };

  const handleResetPassword = (id: string, pwd: string) => {
    setTechs(prev => prev.map(t => t.id === id ? { ...t, password: pwd } : t));
  };

  const actifs = techs.filter(t => t.statut === 'actif').length;
  const totalMissions = techs.reduce((s, t) => s + t.missions, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="section-title">Tous les techniciens</h2>
          <p className="text-sm text-text-muted mt-1">{techs.length} technicien{techs.length > 1 ? 's' : ''} sur la plateforme</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 text-sm shrink-0">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {techs.map((tech) => (
          <div key={tech.id} className="card space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-text">{tech.prenom} {tech.nom}</h3>
                <p className="text-xs text-text-muted">{tech.email}</p>
                <p className="text-xs text-primary font-medium mt-0.5">{tech.entreprise}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                tech.statut === 'actif' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
              }`}>
                {tech.statut}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">{tech.missions}</p>
                <p className="text-xs text-text-muted mt-1">Mission(s)</p>
              </div>
              <div className="bg-surface rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">92%</p>
                <p className="text-xs text-text-muted mt-1">Performance</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Clock className="w-3.5 h-3.5" />
              {tech.derniereActivite}
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <Link href="/admin/interventions" className="flex-1 btn-primary text-sm text-center">
                Missions
              </Link>
              <button onClick={() => setCredTech(tech)} className="flex-1 btn-secondary text-sm flex items-center justify-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" /> Identifiants
              </button>
              <button onClick={() => setEditTech(tech)} className="px-3 btn-secondary text-sm">
                Éditer
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-bold text-lg text-text font-display mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Résumé plateforme
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-3xl font-bold text-primary">{actifs}</p>
            <p className="text-xs text-text-muted mt-2">Techniciens actifs</p>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-3xl font-bold text-success">{totalMissions}</p>
            <p className="text-xs text-text-muted mt-2">Missions en cours</p>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg">
            <p className="text-3xl font-bold text-warning">95%</p>
            <p className="text-xs text-text-muted mt-2">Taux de complétion</p>
          </div>
        </div>
      </div>

      {showAdd && <AddTechModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
      {editTech && <EditModal tech={editTech} onClose={() => setEditTech(null)} onSave={handleSave} />}
      {credTech && <CredentialsModal tech={credTech} onClose={() => setCredTech(null)} onResetPassword={handleResetPassword} />}
    </div>
  );
}
