'use client';

import { useState } from 'react';
import { Plus, X, MapPin, Droplets, CheckCircle2, Search } from 'lucide-react';
import { mockPiscines, mockEntreprises } from '@/lib/mock-data';
import { TypePiscine } from '@/types';

type Piscine = {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  type: TypePiscine;
  volume?: number;
  entreprise: string;
  actif: boolean;
};

const TYPE_LABELS: Record<TypePiscine, string> = {
  [TypePiscine.PRIVEE]: 'Privée',
  [TypePiscine.COPROPRIETE]: 'Copropriété',
  [TypePiscine.HOTEL]: 'Hôtel / Résidence',
};

const TYPE_COLORS: Record<TypePiscine, string> = {
  [TypePiscine.PRIVEE]: 'bg-primary/10 text-primary',
  [TypePiscine.COPROPRIETE]: 'bg-aqua-50 text-aqua-700',
  [TypePiscine.HOTEL]: 'bg-warning/10 text-warning',
};

function AddModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (p: Omit<Piscine, 'id' | 'actif'>) => void;
}) {
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [type, setType] = useState<TypePiscine>(TypePiscine.PRIVEE);
  const [volume, setVolume] = useState('');
  const [entreprise, setEntreprise] = useState(mockEntreprises[0]?.nom ?? '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ nom, adresse, ville, type, volume: volume ? Number(volume) * 1000 : undefined, entreprise });
    setSaved(true);
    setTimeout(onClose, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-text font-display">Nouvelle piscine</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg"><X className="w-5 h-5 text-text-muted" /></button>
        </div>
        {saved ? (
          <div className="flex items-center gap-2 text-success py-4"><CheckCircle2 className="w-5 h-5" /><span className="font-semibold">Piscine créée !</span></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Nom</label>
              <input value={nom} onChange={e => setNom(e.target.value)} required className="input-base" placeholder="Ex. Villa Dupont" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Adresse</label>
              <input value={adresse} onChange={e => setAdresse(e.target.value)} required className="input-base" placeholder="12 rue des Pins" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Ville</label>
                <input value={ville} onChange={e => setVille(e.target.value)} required className="input-base" placeholder="Nice" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Volume (m³)</label>
                <input type="number" value={volume} onChange={e => setVolume(e.target.value)} className="input-base" placeholder="Ex. 45" min="1" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value as TypePiscine)} className="input-base">
                {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Entreprise</label>
              <select value={entreprise} onChange={e => setEntreprise(e.target.value)} className="input-base">
                {mockEntreprises.map(e => <option key={e.id} value={e.nom}>{e.nom}</option>)}
              </select>
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

export default function AdminPiscinesPage() {
  const [piscines, setPiscines] = useState<Piscine[]>(
    mockPiscines.map(p => ({
      id: p.id,
      nom: p.nom,
      adresse: p.adresse,
      ville: p.ville,
      type: p.type,
      volume: p.volume,
      entreprise: mockEntreprises[0]?.nom ?? '',
      actif: p.actif,
    }))
  );
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (data: Omit<Piscine, 'id' | 'actif'>) => {
    setPiscines(prev => [...prev, { id: `pool_${Date.now()}`, actif: true, ...data }]);
  };

  const filtered = piscines.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase()) ||
    p.ville.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="section-title">Toutes les piscines</h2>
          <p className="text-sm text-text-muted mt-1">{piscines.length} piscine{piscines.length > 1 ? 's' : ''} sur la plateforme</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 text-sm shrink-0">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input type="text" placeholder="Rechercher par nom ou ville..." value={search} onChange={e => setSearch(e.target.value)} className="input-base pl-12" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="card space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-aqua-50 flex items-center justify-center shrink-0">
                  <Droplets className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-text truncate">{p.nom}</h3>
                  <p className="text-xs text-primary font-medium">{p.entreprise}</p>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${TYPE_COLORS[p.type]}`}>
                {TYPE_LABELS[p.type]}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {p.adresse}, {p.ville}
              </div>
              {p.volume && (
                <div className="flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 shrink-0" />
                  Volume : {(p.volume / 1000).toFixed(0)} m³
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${p.actif ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                {p.actif ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-text-muted">Aucune piscine trouvée</div>}

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
    </div>
  );
}
