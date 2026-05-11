'use client';

import { MapPin, Wrench, AlertCircle, Calendar, Droplets, Thermometer, FlaskConical, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { mockPiscines } from '@/lib/mock-data';

interface PoolDetailsPageProps {
  params: {
    id: string;
  };
}

const TABS = [
  { key: 'info', label: 'Infos' },
  { key: 'history', label: 'Historique' },
  { key: 'anomalies', label: 'Anomalies' },
];

export default function PoolDetailsPage({ params }: PoolDetailsPageProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'history' | 'anomalies'>('info');

  const piscine = mockPiscines.find((p) => p.id === params.id);

  if (!piscine) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
        <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mb-4">
          <Droplets className="w-8 h-8 text-text-muted" />
        </div>
        <p className="font-bold text-text">Piscine non trouvée</p>
        <p className="text-sm text-text-muted mt-1">Vérifiez l'identifiant et réessayez</p>
      </div>
    );
  }

  const typeLabel = piscine.type === 'PRIVEE' ? 'Privée' : piscine.type === 'COPROPRIETE' ? 'Copropriété' : 'Hôtel';

  return (
    <div className="space-y-0">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-accent to-primary text-white px-5 pt-6 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white" />
          <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-white" />
        </div>
        <div className="relative">
          <h1 className="text-2xl font-black font-display leading-tight">{piscine.nom}</h1>
          <div className="flex items-center gap-1.5 text-white/75 mt-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <p className="text-sm">{piscine.adresse}, {piscine.ville}</p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-5">
            {[
              { label: 'Type', value: typeLabel },
              { label: 'Volume', value: piscine.volume ? `${piscine.volume}L` : '—' },
              { label: 'Équip.', value: `${piscine.equipements.length}` },
            ].map(s => (
              <div key={s.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-lg font-black font-mono">{s.value}</p>
                <p className="text-[10px] text-white/70 mt-0.5 font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border/70 px-4 sticky top-12 z-20">
        <div className="flex gap-0">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 py-3.5 text-sm font-bold border-b-2 transition-all ${
                activeTab === key
                  ? 'text-primary border-primary'
                  : 'text-text-muted border-transparent hover:text-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-8 space-y-3">
        {activeTab === 'info' && (
          <>
            {piscine.equipements.length > 0 && (
              <div className="bg-white border border-border/70 rounded-2xl shadow-[0_1px_4px_rgba(11,94,168,0.06)] overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-border/50 bg-surface/50">
                  <Wrench className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-text text-sm">Équipements</h3>
                </div>
                <ul className="divide-y divide-border/40">
                  {piscine.equipements.map((equip, i) => (
                    <li key={i} className="flex items-center gap-3 px-4 py-3 text-sm text-text">
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      {equip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {piscine.note && (
              <div className="bg-white border border-accent/30 rounded-2xl p-4 shadow-[0_1px_4px_rgba(11,94,168,0.06)]">
                <h3 className="font-bold text-text text-sm mb-2">Notes</h3>
                <p className="text-sm text-text-muted leading-relaxed">{piscine.note}</p>
              </div>
            )}

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <p className="text-xs font-semibold text-primary/70 mb-1">Enregistrée le</p>
              <p className="text-sm font-bold text-primary">
                {new Date(piscine.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-[10px] text-primary/50 mt-1 font-mono">ID {piscine.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {[
              { i: 1, ph: '7.2', cl: '1.8', temp: '26°C', ok: true },
              { i: 2, ph: '7.4', cl: '1.5', temp: '25°C', ok: true },
              { i: 3, ph: '7.8', cl: '1.1', temp: '24°C', ok: false },
            ].map(({ i, ph, cl, temp, ok }) => (
              <div
                key={i}
                className="bg-white border border-border/70 rounded-2xl shadow-[0_1px_4px_rgba(11,94,168,0.06)] overflow-hidden hover:border-primary/20 active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3 p-4">
                  <div className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${ok ? 'bg-success' : 'bg-warning'}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-text text-sm">Passage #{i}</p>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${ok ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        {ok ? 'Conforme' : 'Anomalie'}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mb-2.5">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <div className="flex gap-2">
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${ok ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        <FlaskConical className="w-3 h-3" /> pH {ph}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/8 text-primary">
                        <Droplets className="w-3 h-3" /> Cl {cl}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent">
                        <Thermometer className="w-3 h-3" /> {temp}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'anomalies' && (
          <div className="space-y-3">
            <div className="bg-white border border-warning/30 rounded-2xl shadow-[0_1px_4px_rgba(11,94,168,0.06)] overflow-hidden">
              <div className="flex items-start gap-3 p-4">
                <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-text text-sm">pH légèrement élevé</p>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-warning/10 text-warning">Actif</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    Dernier passage : pH 7.8 (norme : 7.0 – 7.6)
                  </p>
                  <button className="mt-3 text-xs font-bold text-warning bg-warning/10 hover:bg-warning/20 active:scale-95 px-3 py-1.5 rounded-xl transition-all">
                    Voir le rapport →
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center py-8">
              <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6 text-success" />
              </div>
              <p className="text-sm font-semibold text-text-muted">Aucune autre anomalie active</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
