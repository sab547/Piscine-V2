'use client';

import { Search, Droplets, ChevronRight, MapPin, Waves, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { mockPiscines } from '@/lib/mock-data';

const TYPE_LABELS: Record<string, string> = {
  PRIVEE: 'Privée',
  COPROPRIETE: 'Copropriété',
  HOTEL: 'Hôtel',
};

const TYPE_COLORS: Record<string, string> = {
  PRIVEE: 'bg-primary/10 text-primary',
  COPROPRIETE: 'bg-accent/10 text-accent',
  HOTEL: 'bg-purple-100 text-purple-600',
};

const MAP_EMBED_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=6.8%2C43.4%2C7.3%2C43.8&layer=mapnik&marker=43.55%2C7.01';

export default function PiscinesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'PRIVEE' | 'COPROPRIETE' | 'HOTEL'>('all');
  const [showMap, setShowMap] = useState(false);

  const filtered = mockPiscines.filter((p) => {
    const matchesSearch =
      p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ville.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="pb-6 space-y-0">
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white px-5 pt-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold font-display">Mes piscines</h1>
            <p className="text-sm text-white/70 mt-0.5">{mockPiscines.length} contrats actifs</p>
          </div>
          <button
            onClick={() => setShowMap((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              showMap ? 'bg-white text-primary' : 'bg-white/20 text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            Carte
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Rechercher une piscine…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/15 border border-white/20 text-white placeholder:text-white/50 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:bg-white/25 transition-colors"
          />
        </div>
      </div>

      {/* Map */}
      {showMap && (
        <div className="mx-4 mt-4 rounded-2xl overflow-hidden border border-border shadow-sm">
          <iframe
            src={MAP_EMBED_URL}
            className="w-full h-52"
            title="Carte des piscines"
            loading="lazy"
          />
          <div className="bg-white px-4 py-2.5 flex gap-3 overflow-x-auto">
            {mockPiscines.map((p) => (
              <div key={p.id} className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <span className="text-xs font-semibold text-text">{p.nom}</span>
                <span className="text-xs text-text-muted">{p.ville}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 pt-4 space-y-4">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {[
            { key: 'all', label: 'Toutes' },
            { key: 'PRIVEE', label: 'Privée' },
            { key: 'COPROPRIETE', label: 'Copropriété' },
            { key: 'HOTEL', label: 'Hôtel' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterType(key as any)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all flex-shrink-0 ${
                filterType === key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-border text-text-muted hover:border-primary/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-text-muted">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Pool cards */}
        <div className="space-y-3">
          {filtered.map((piscine) => (
            <Link
              key={piscine.id}
              href={`/piscines/${piscine.id}`}
              className="block bg-white border border-border/70 rounded-2xl p-4 shadow-[0_1px_4px_rgba(11,94,168,0.06)] hover:border-primary/30 hover:shadow-ocean-sm active:scale-[0.99] transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Droplets className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h3 className="font-bold text-text group-hover:text-primary transition-colors text-sm truncate">
                      {piscine.nom}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{piscine.adresse}, {piscine.ville} {piscine.codePostal}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${TYPE_COLORS[piscine.type] || 'bg-border text-text-muted'}`}>
                        {TYPE_LABELS[piscine.type] || piscine.type}
                      </span>
                      {piscine.volume && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-surface text-text-muted">
                          {(piscine.volume / 1000).toFixed(0)} m³
                        </span>
                      )}
                      {piscine.equipements?.length > 0 && (
                        <span className="text-[10px] text-text-muted">
                          {piscine.equipements.length} équipements
                        </span>
                      )}
                    </div>

                    {piscine.note && (
                      <p className="text-xs text-text-muted italic truncate">{piscine.note}</p>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors flex-shrink-0 mt-2" />
              </div>
            </Link>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Waves className="w-7 h-7 text-text-muted" />
              </div>
              <p className="font-semibold text-text-muted">Aucune piscine trouvée</p>
              <p className="text-xs text-text-muted mt-1">Modifiez votre recherche ou vos filtres</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
