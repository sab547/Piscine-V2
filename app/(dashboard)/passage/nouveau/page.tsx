'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Droplets, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { mockPiscines } from '@/lib/mock-data';
import Link from 'next/link';

export default function NouveauPassagePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleStart = () => {
    if (!selected) return;
    router.push(`/passage/${selected}`);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/technicien" className="p-2 rounded-lg hover:bg-border transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-muted" />
        </Link>
        <div>
          <h1 className="text-xl font-bold font-display text-text">Nouveau passage</h1>
          <p className="text-sm text-text-muted">Sélectionnez la piscine à traiter</p>
        </div>
      </div>

      <div className="space-y-2">
        {mockPiscines.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
              selected === p.id
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border bg-surface hover:border-primary/40'
            }`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              selected === p.id ? 'bg-primary text-white' : 'bg-aqua-50'
            }`}>
              {selected === p.id
                ? <CheckCircle2 className="w-4 h-4" />
                : <Droplets className="w-4 h-4 text-primary" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-text">{p.nom}</p>
              <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                {p.adresse}, {p.ville}
              </p>
              {p.volume && (
                <p className="text-[11px] text-text-muted mt-0.5">{(p.volume / 1000).toFixed(0)} m³</p>
              )}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleStart}
        disabled={!selected}
        className="btn-primary w-full"
      >
        Démarrer l'intervention
      </button>
    </div>
  );
}
