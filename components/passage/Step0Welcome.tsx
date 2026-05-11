'use client';

import { AlertCircle, Clock, MapPin, Droplets, ChevronRight } from 'lucide-react';

interface Step0WelcomeProps {
  mission: {
    nom: string;
    adresse: string;
    ville: string;
    heure: string;
  };
  hasAlert?: boolean;
  onStart: () => void;
}

export function Step0Welcome({ mission, hasAlert = false, onStart }: Step0WelcomeProps) {
  return (
    <div className="min-h-[70vh] flex flex-col">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-accent text-white px-5 pt-8 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white" />
        </div>
        <div className="relative text-center">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black font-display leading-tight mb-2">{mission.nom}</h2>
          <div className="flex items-center justify-center gap-1.5 text-white/75">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <p className="text-sm">{mission.adresse}, {mission.ville}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-5 space-y-3 -mt-4">
        {/* Alert */}
        {hasAlert && (
          <div className="bg-white border border-warning/40 rounded-2xl shadow-[0_1px_4px_rgba(11,94,168,0.06)] overflow-hidden">
            <div className="flex items-start gap-3 p-4">
              <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-bold text-warning">Alerte détectée</p>
                <p className="text-xs text-text-muted mt-0.5">
                  pH ou chlore hors normes à la dernière visite
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Time card */}
        <div className="bg-white border border-border/70 rounded-2xl shadow-[0_1px_4px_rgba(11,94,168,0.06)] p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <Clock className="w-4 h-4 text-primary" />
            <p className="text-xs font-bold text-text-muted uppercase tracking-wide">Heure prévue</p>
          </div>
          <p className="text-4xl font-black text-primary font-mono">{mission.heure}</p>
        </div>

        {/* Info list */}
        <div className="bg-white border border-border/70 rounded-2xl shadow-[0_1px_4px_rgba(11,94,168,0.06)] divide-y divide-border/50">
          {[
            { label: 'Mesures pH', detail: 'Vérification et ajustement' },
            { label: 'Chlore libre', detail: 'Analyse et traitement' },
            { label: 'Température', detail: 'Relevé et rapport' },
          ].map(({ label, detail }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-primary/40 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text">{label}</p>
                <p className="text-xs text-text-muted">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-4 rounded-2xl shadow-ocean-sm active:scale-95 transition-all duration-150 text-base mt-2"
        >
          Démarrer l'intervention
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
