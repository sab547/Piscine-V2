'use client';

import { Search, MapPin, X, Mail, Plus, CheckCircle2, ChevronRight, Calendar, Upload, Download, AlertCircle, FileJson, Droplets, Users, Wrench, ListChecks } from 'lucide-react';
import { useState, useRef } from 'react';
import { mockEntreprises, mockAllTechniciens, mockMissions } from '@/lib/mock-data';

type Entreprise = typeof mockEntreprises[0];
type NewEntreprise = { nom: string; email: string; ville: string };

type ImportedPiscine = { nom: string; adresse: string; ville: string; type: string; volume?: number };
type ImportedTechnicien = { prenom: string; nom: string; email: string };
type ImportedIntervention = { piscine: string; date: string; statut: string; typePassage: string };
type ImportData = {
  entreprise: { nom: string; email: string; ville: string } | null;
  techniciens: ImportedTechnicien[];
  piscines: ImportedPiscine[];
  interventions: ImportedIntervention[];
};

const JSON_TEMPLATE: ImportData & { _instructions: Record<string, string> } = {
  _instructions: {
    type_piscine: "Valeurs acceptées : PRIVEE | COPROPRIETE | HOTEL",
    statut_intervention: "Valeurs acceptées : PLANIFIE | EN_COURS | COMPLETE",
    typePassage: "Valeurs acceptées : ENTRETIEN | TRAITEMENT | RENOVATION | OUVERTURE | FERMETURE",
    volume_piscine: "Volume en m³ (optionnel)",
  },
  entreprise: {
    nom: "Piscines du Soleil",
    email: "contact@piscinesdusoleil.fr",
    ville: "Marseille",
  },
  techniciens: [
    { prenom: "Jean", nom: "Dupont", email: "jean.dupont@piscinesdusoleil.fr" },
    { prenom: "Marie", nom: "Martin", email: "marie.martin@piscinesdusoleil.fr" },
  ],
  piscines: [
    { nom: "Villa Fontaine", adresse: "12 rue des Pins", ville: "Nice", type: "PRIVEE", volume: 45 },
    { nom: "Résidence Les Iris", adresse: "8 avenue des Fleurs", ville: "Cannes", type: "COPROPRIETE", volume: 120 },
    { nom: "Hôtel Bellevue", adresse: "3 boulevard de la Mer", ville: "Antibes", type: "HOTEL", volume: 300 },
  ],
  interventions: [
    { piscine: "Villa Fontaine", date: "2026-04-15", statut: "COMPLETE", typePassage: "ENTRETIEN" },
    { piscine: "Villa Fontaine", date: "2026-03-20", statut: "COMPLETE", typePassage: "TRAITEMENT" },
    { piscine: "Résidence Les Iris", date: "2026-05-01", statut: "PLANIFIE", typePassage: "OUVERTURE" },
  ],
};

const CSV_PISCINES_TEMPLATE = `nom,adresse,ville,type,volume
Villa Fontaine,12 rue des Pins,Nice,PRIVEE,45
Résidence Les Iris,8 avenue des Fleurs,Cannes,COPROPRIETE,120
Hôtel Bellevue,3 boulevard de la Mer,Antibes,HOTEL,300`;

function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ImportModal({ onClose, onImport }: {
  onClose: () => void;
  onImport: (data: ImportData) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [parsed, setParsed] = useState<ImportData | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [imported, setImported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseJSON = (text: string) => {
    const data = JSON.parse(text);
    if (!data.entreprise?.nom) throw new Error('Champ "entreprise.nom" manquant');
    if (!data.entreprise?.email) throw new Error('Champ "entreprise.email" manquant');
    return {
      entreprise: {
        nom: String(data.entreprise.nom),
        email: String(data.entreprise.email),
        ville: String(data.entreprise.ville || ''),
      },
      techniciens: (data.techniciens || []).map((t: Record<string, string>) => ({
        prenom: String(t.prenom || ''),
        nom: String(t.nom || ''),
        email: String(t.email || ''),
      })).filter((t: ImportedTechnicien) => t.prenom && t.nom),
      piscines: (data.piscines || []).map((p: Record<string, string>) => ({
        nom: String(p.nom || ''),
        adresse: String(p.adresse || ''),
        ville: String(p.ville || ''),
        type: String(p.type || 'PRIVEE').toUpperCase(),
        volume: p.volume ? Number(p.volume) : undefined,
      })).filter((p: ImportedPiscine) => p.nom),
      interventions: (data.interventions || []).map((i: Record<string, string>) => ({
        piscine: String(i.piscine || ''),
        date: String(i.date || ''),
        statut: String(i.statut || 'PLANIFIE').toUpperCase(),
        typePassage: String(i.typePassage || 'ENTRETIEN').toUpperCase(),
      })).filter((i: ImportedIntervention) => i.piscine && i.date),
    } as ImportData;
  };

  const parseCSV = (text: string): ImportData => {
    const lines = text.trim().split('\n').filter(l => l.trim());
    if (lines.length < 2) throw new Error('Le fichier CSV est vide ou ne contient pas de données');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
    const piscines = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = values[i] || ''; });
      return {
        nom: row.nom || row.name || '',
        adresse: row.adresse || row.address || '',
        ville: row.ville || row.city || '',
        type: (row.type || 'PRIVEE').toUpperCase(),
        volume: row.volume ? Number(row.volume) : undefined,
      };
    }).filter(p => p.nom);

    if (piscines.length === 0) throw new Error('Aucune piscine valide trouvée dans le CSV (colonne "nom" requise)');
    return { entreprise: null, techniciens: [], piscines, interventions: [] };
  };

  const handleFile = (file: File) => {
    setError('');
    setParsed(null);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        if (file.name.toLowerCase().endsWith('.json')) {
          setParsed(parseJSON(text));
        } else if (file.name.toLowerCase().endsWith('.csv')) {
          setParsed(parseCSV(text));
        } else {
          setError('Format non supporté. Utilisez un fichier .json ou .csv');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fichier invalide');
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleConfirm = () => {
    if (!parsed) return;
    onImport(parsed);
    setImported(true);
    setTimeout(onClose, 1200);
  };

  const VALID_TYPES = ['PRIVEE', 'COPROPRIETE', 'HOTEL'];
  const typeWarnings = parsed?.piscines.filter(p => !VALID_TYPES.includes(p.type)) ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-text font-display">Importer une entreprise</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg"><X className="w-5 h-5 text-text-muted" /></button>
        </div>

        {imported ? (
          <div className="flex items-center gap-2 text-success py-6">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-semibold">Import réussi !</p>
              <p className="text-sm text-text-muted">{parsed?.entreprise?.nom ?? 'Données'} ajouté à la plateforme</p>
            </div>
          </div>
        ) : (
          <>
            {/* Template downloads */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Modèles à télécharger</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => downloadBlob(JSON.stringify(JSON_TEMPLATE, null, 2), 'modele-pooltrack.json', 'application/json')}
                  className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                >
                  <FileJson className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text">JSON complet</p>
                    <p className="text-[10px] text-text-muted truncate">Tout en un fichier</p>
                  </div>
                  <Download className="w-3.5 h-3.5 text-text-muted ml-auto shrink-0" />
                </button>
                <button
                  onClick={() => downloadBlob(CSV_PISCINES_TEMPLATE, 'modele-piscines.csv', 'text/csv')}
                  className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                >
                  <ListChecks className="w-5 h-5 text-aqua-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-text">CSV piscines</p>
                    <p className="text-[10px] text-text-muted truncate">Excel / Sheets</p>
                  </div>
                  <Download className="w-3.5 h-3.5 text-text-muted ml-auto shrink-0" />
                </button>
              </div>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer select-none ${
                dragging ? 'border-primary bg-primary/5' : parsed ? 'border-success/60 bg-success/5' : 'border-border hover:border-primary/50 hover:bg-surface'
              }`}
            >
              {parsed ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-sm font-semibold text-text truncate">{fileName}</p>
                  <p className="text-xs text-text-muted mt-1">Cliquer pour changer de fichier</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-sm font-semibold text-text">Déposer le fichier ici</p>
                  <p className="text-xs text-text-muted mt-1">ou cliquer pour parcourir</p>
                  <p className="text-[10px] text-text-muted mt-2 bg-surface inline-block px-2 py-0.5 rounded-full">.json · .csv</p>
                </>
              )}
              <input ref={fileInputRef} type="file" accept=".json,.csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-danger/10 text-danger text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {typeWarnings.length > 0 && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-warning/10 text-warning text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{typeWarnings.length} piscine(s) avec un type non reconnu seront importées comme «&nbsp;PRIVEE&nbsp;».</span>
              </div>
            )}

            {/* Preview */}
            {parsed && (
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-surface border-b border-border">
                  <p className="text-xs font-bold uppercase tracking-wider text-text-muted">Aperçu de l'import</p>
                </div>
                <div className="p-4 space-y-3">
                  {parsed.entreprise ? (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-text">{parsed.entreprise.nom}</p>
                        <p className="text-xs text-text-muted truncate">{parsed.entreprise.email} · {parsed.entreprise.ville}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-warning bg-warning/10 rounded-lg px-3 py-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      CSV : sélectionnez l'entreprise cible après import
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-surface rounded-lg p-2.5 text-center">
                      <p className="text-xl font-bold text-primary">{parsed.techniciens.length}</p>
                      <p className="text-[10px] text-text-muted">Techniciens</p>
                    </div>
                    <div className="bg-surface rounded-lg p-2.5 text-center">
                      <p className="text-xl font-bold text-aqua-600">{parsed.piscines.length}</p>
                      <p className="text-[10px] text-text-muted">Piscines</p>
                    </div>
                    <div className="bg-surface rounded-lg p-2.5 text-center">
                      <p className="text-xl font-bold text-warning">{parsed.interventions.length}</p>
                      <p className="text-[10px] text-text-muted">Interventions</p>
                    </div>
                  </div>

                  {parsed.techniciens.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5"><Wrench className="w-3 h-3" />Techniciens</p>
                      {parsed.techniciens.slice(0, 3).map((t, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-text-muted pl-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                          {t.prenom} {t.nom} — {t.email}
                        </div>
                      ))}
                      {parsed.techniciens.length > 3 && <p className="text-xs text-text-muted pl-4">+{parsed.techniciens.length - 3} autres</p>}
                    </div>
                  )}

                  {parsed.piscines.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5"><Droplets className="w-3 h-3" />Piscines</p>
                      {parsed.piscines.slice(0, 4).map((p, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-text-muted pl-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-aqua-500 shrink-0" />
                          {p.nom} — {p.ville}{p.volume ? ` · ${p.volume} m³` : ''}
                        </div>
                      ))}
                      {parsed.piscines.length > 4 && <p className="text-xs text-text-muted pl-4">+{parsed.piscines.length - 4} autres</p>}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button type="button" onClick={onClose} className="flex-1 btn-secondary">Annuler</button>
              <button
                onClick={handleConfirm}
                disabled={!parsed}
                className="flex-1 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Importer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AddModal({ onClose, onSave }: { onClose: () => void; onSave: (e: NewEntreprise) => void }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [ville, setVille] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ nom, email, ville });
    setSaved(true);
    setTimeout(onClose, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-text font-display">Nouvelle entreprise</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg"><X className="w-5 h-5 text-text-muted" /></button>
        </div>
        {saved ? (
          <div className="flex items-center gap-2 text-success py-4"><CheckCircle2 className="w-5 h-5" /><span className="font-semibold">Entreprise créée !</span></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Nom de l'entreprise</label>
              <input value={nom} onChange={e => setNom(e.target.value)} required className="input-base" placeholder="Ex. Piscines du Soleil" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Email de connexion</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-base" placeholder="pisciniste@exemple.com" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">Ville</label>
              <input value={ville} onChange={e => setVille(e.target.value)} required className="input-base" placeholder="Ex. Marseille" />
            </div>
            <p className="text-xs text-text-muted">Un mot de passe provisoire sera généré et envoyé par email.</p>
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

function DetailModal({ e, onClose }: { e: Entreprise; onClose: () => void }) {
  const techs = mockAllTechniciens.filter(t => t.entreprise === e.nom);
  const interventions = mockMissions.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col" onClick={ev => ev.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
          <div>
            <h2 className="font-bold text-lg text-text">{e.nom}</h2>
            <p className="text-xs text-text-muted">{e.ville} · depuis {new Date(e.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-border text-text-muted"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Coordonnées</h3>
            <div className="bg-bg rounded-xl p-4 flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm text-text">{e.email}</span>
            </div>
          </section>
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Techniciens ({techs.length})</h3>
            {techs.map(t => (
              <div key={t.id} className="bg-bg rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{t.prenom[0]}{t.nom[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text">{t.prenom} {t.nom}</p>
                  <p className="text-xs text-text-muted">{t.email}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success">{t.statut}</span>
              </div>
            ))}
          </section>
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Dernières interventions</h3>
            {interventions.map(m => (
              <div key={m.id} className="bg-bg rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="w-4 h-4 text-text-muted shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-text truncate">{m.client}</p>
                    <p className="text-xs text-text-muted">{new Date(m.datePrevu).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  m.statut === 'COMPLETE' ? 'bg-success/15 text-success' :
                  m.statut === 'EN_COURS' ? 'bg-warning/15 text-warning' : 'bg-border text-text-muted'
                }`}>
                  {m.statut === 'COMPLETE' ? 'Terminé' : m.statut === 'EN_COURS' ? 'En cours' : 'Prévu'}
                </span>
              </div>
            ))}
          </section>
        </div>
        <div className="p-4 border-t border-border">
          <button onClick={onClose} className="w-full btn-primary text-sm">Fermer</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminEntreprisesPage() {
  const [entreprises, setEntreprises] = useState(mockEntreprises);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selected, setSelected] = useState<Entreprise | null>(null);

  const handleAdd = (data: NewEntreprise) => {
    setEntreprises(prev => [...prev, {
      id: `tenant_${Date.now()}`,
      nom: data.nom,
      email: data.email,
      ville: data.ville,
      statut: 'actif' as const,
      nbTechniciens: 0,
      nbPiscines: 0,
      nbInterventions: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }]);
  };

  const handleImport = (data: ImportData) => {
    if (data.entreprise) {
      setEntreprises(prev => [...prev, {
        id: `tenant_${Date.now()}`,
        nom: data.entreprise!.nom,
        email: data.entreprise!.email,
        ville: data.entreprise!.ville,
        statut: 'actif' as const,
        nbTechniciens: data.techniciens.length,
        nbPiscines: data.piscines.length,
        nbInterventions: data.interventions.length,
        createdAt: new Date().toISOString().split('T')[0],
      }]);
    }
  };

  const filtered = entreprises.filter(e =>
    e.nom.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="section-title">Entreprises abonnées</h2>
          <p className="text-sm text-text-muted mt-1">{entreprises.length} entreprise{entreprises.length > 1 ? 's' : ''} sur la plateforme</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setShowImport(true)} className="btn-secondary flex items-center gap-2 text-sm">
            <Upload className="w-4 h-4" /> Importer
          </button>
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input type="text" placeholder="Rechercher une entreprise..." value={search} onChange={e => setSearch(e.target.value)} className="input-base pl-12" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(e => (
          <div key={e.id} className="card space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text truncate">{e.nom}</h3>
                <p className="text-xs text-text-muted">{e.email}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-success/15 text-success shrink-0 ml-2">{e.statut}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-surface rounded-lg p-2">
                <p className="text-lg font-bold text-primary">{e.nbTechniciens}</p>
                <p className="text-[10px] text-text-muted">Techs</p>
              </div>
              <div className="bg-surface rounded-lg p-2">
                <p className="text-lg font-bold text-aqua-600">{e.nbPiscines}</p>
                <p className="text-[10px] text-text-muted">Piscines</p>
              </div>
              <div className="bg-surface rounded-lg p-2">
                <p className="text-lg font-bold text-warning">{e.nbInterventions}</p>
                <p className="text-[10px] text-text-muted">Interv.</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <MapPin className="w-3.5 h-3.5" />
              {e.ville} · depuis {new Date(e.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
            </div>
            <button onClick={() => setSelected(e)} className="w-full btn-primary text-sm flex items-center justify-center gap-2">
              Voir détails <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-text-muted">Aucune entreprise trouvée</div>}

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={handleAdd} />}
      {showImport && <ImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
      {selected && <DetailModal e={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
