'use client';

import { AlertCircle, Clock, MapPin } from 'lucide-react';

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
    <div className="px-4 py-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-text font-display mb-2">
          {mission.nom}
        </h2>
        <div className="flex items-center justify-center gap-2 text-text-muted">
          <MapPin className="w-4 h-4" />
          <p className="text-sm">{mission.adresse}</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-text-muted mt-2">
          <MapPin className="w-4 h-4" />
          <p className="text-sm">{mission.ville}</p>
        </div>
      </div>

      {hasAlert && (
        <div className="bg-warning/10 border border-warning rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-warning">Alerte détectée</p>
            <p className="text-xs text-warning/80 mt-1">
              pH ou chlore hors normes à la dernière visite
            </p>
          </div>
        </div>
      )}

      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-primary" />
          <p className="text-sm font-semibold text-text">Heure prévue</p>
        </div>
        <p className="text-2xl font-bold text-primary font-mono">
          {mission.heure}
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
      >
        Démarrer l'intervention
      </button>
    </div>
  );
}
