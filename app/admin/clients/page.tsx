'use client';

import { Search, MapPin, Droplets } from 'lucide-react';
import { useState } from 'react';
import { mockProprietaire, mockPiscines } from '@/lib/mock-data';

export default function AdminClientsPage() {
  const [search, setSearch] = useState('');

  const clients = [
    {
      id: mockProprietaire.id,
      nom: `${mockProprietaire.prenom} ${mockProprietaire.nom}`,
      email: mockProprietaire.email,
      telephone: mockProprietaire.telephone,
      ville: 'Côte d\'Azur',
      piscines: mockPiscines.length,
      derniereIntervention: '2026-05-06',
    },
  ];

  const filtered = clients.filter(
    (c) =>
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Gestion des clients</h2>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base pl-12"
        />
      </div>

      {/* Clients Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((client) => (
          <div key={client.id} className="card space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-text">{client.nom}</h3>
                <p className="text-xs text-text-muted">{client.email}</p>
              </div>
              <span className="badge-teal">{client.piscines}</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-text-muted">
                <MapPin className="w-4 h-4" />
                {client.ville}
              </div>
              <div className="flex items-center gap-2 text-text-muted">
                <Droplets className="w-4 h-4" />
                {client.piscines} piscine{client.piscines > 1 ? 's' : ''}
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs text-text-muted">
                Dernière intervention:{' '}
                <span className="font-semibold text-text">{client.derniereIntervention}</span>
              </p>
            </div>

            <button className="w-full btn-primary text-sm">Voir détails</button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p>Aucun client trouvé</p>
        </div>
      )}
    </div>
  );
}
