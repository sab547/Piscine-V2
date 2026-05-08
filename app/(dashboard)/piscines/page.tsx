'use client';

import { Search, Droplets, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { mockPiscines } from '@/lib/mock-data';

export default function PiscinesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'privee' | 'copropriete' | 'hotel'>('all');

  const filtered = mockPiscines.filter((p) => {
    const matchesSearch =
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ville.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || p.type.toLowerCase() === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-text font-display">
        Piscines
      </h1>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="Chercher une piscine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-base pl-12"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Toutes', 'Privée', 'Copropriété', 'Hôtel'].map((type, i) => (
            <button
              key={type}
              onClick={() =>
                setFilterType(
                  i === 0
                    ? 'all'
                    : (type.toLowerCase() as any)
                )
              }
              className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-sm transition-colors ${
                (i === 0 && filterType === 'all') ||
                (i > 0 && filterType === type.toLowerCase())
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text hover:border-primary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-text-muted font-semibold">
          {filtered.length} piscine{filtered.length !== 1 ? 's' : ''}
        </p>

        {filtered.map((piscine) => (
          <Link
            key={piscine.id}
            href={`/piscines/${piscine.id}`}
            className="block bg-surface border border-border hover:border-primary hover:shadow-md rounded-lg p-4 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-text group-hover:text-primary transition-colors">
                  {piscine.nom}
                </h3>
                <p className="text-xs text-text-muted">
                  {piscine.adresse}, {piscine.ville} {piscine.codePostal}
                </p>

                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-accent/20 text-accent px-2 py-1 rounded-full font-semibold">
                    {piscine.type === 'PRIVEE'
                      ? 'Privée'
                      : piscine.type === 'COPROPRIETE'
                        ? 'Copropriété'
                        : 'Hôtel'}
                  </span>
                  {piscine.volume && (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                      {piscine.volume}L
                    </span>
                  )}
                </div>

                {piscine.note && (
                  <p className="text-xs text-text-muted italic mt-2">
                    {piscine.note}
                  </p>
                )}
              </div>

              <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors flex-shrink-0 mt-0.5" />
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <Droplets className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="text-text-muted">Aucune piscine trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
