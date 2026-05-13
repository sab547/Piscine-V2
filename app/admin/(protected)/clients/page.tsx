'use client';

import { Search, MapPin, Users, Wrench, ListChecks, ChevronRight, X, Mail } from 'lucide-react';
import { useState } from 'react';
import { mockEntreprises, mockAllTechniciens, mockMissions, mockPiscines } from '@/lib/mock-data';

type Entreprise = typeof mockEntreprises[0];

function EntrepriseDetailModal({ e, onClose }: { e: Entreprise; onClose: () => void }) {
  const techs = mockAllTechniciens.filter(t => t.entreprise === e.nom);
  const interventions = mockMissions.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
          <div>
            <h2 className="font-bold text-lg text-text">{e.nom}</h2>
            <p className="text-xs text-text-muted">{e.ville} · depuis {new Date(e.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-border transition-colors text-text-muted">
            <X className="w-5 h-5" />
          </button>
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
            <div className="space-y-2">
              {techs.map(t => (
                <div key={t.id} className="bg-bg rounded-xl p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {t.prenom[0]}{t.nom[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text">{t.prenom} {t.nom}</p>
                    <p className="text-xs text-text-muted">{t.email}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/15 text-success">{t.statut}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Dernières interventions</h3>
            <div className="space-y-2">
              {interventions.map(m => (
                <div key={m.id} className="bg-bg rounded-xl p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-text truncate">{m.client}</p>
                    <p className="text-xs text-text-muted">{new Date(m.datePrevu).toLocaleDateString('fr-FR')} · {m.heure}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    m.statut === 'COMPLETE' ? 'bg-success/15 text-success' :
                    m.statut === 'EN_COURS' ? 'bg-warning/15 text-warning' : 'bg-border text-text-muted'
                  }`}>
                    {m.statut === 'COMPLETE' ? 'Terminé' : m.statut === 'EN_COURS' ? 'En cours' : 'Prévu'}
                  </span>
                </div>
              ))}
            </div>
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
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Entreprise | null>(null);

  const filtered = mockEntreprises.filter(e =>
    e.nom.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Entreprises abonnées</h2>
        <p className="text-sm text-text-muted mt-1">{mockEntreprises.length} entreprise{mockEntreprises.length > 1 ? 's' : ''} sur la plateforme</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="Rechercher une entreprise..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-base pl-12"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(e => (
          <div key={e.id} className="card space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text truncate">{e.nom}</h3>
                <p className="text-xs text-text-muted">{e.email}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-success/15 text-success shrink-0 ml-2">
                {e.statut}
              </span>
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

            <button
              onClick={() => setSelected(e)}
              className="w-full btn-primary text-sm flex items-center justify-center gap-2"
            >
              Voir détails <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">Aucune entreprise trouvée</div>
      )}

      {selected && <EntrepriseDetailModal e={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
