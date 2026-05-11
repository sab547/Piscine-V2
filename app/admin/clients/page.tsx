'use client';

import { Search, MapPin, Mail, Phone, Calendar, ExternalLink, Users } from 'lucide-react';
import { useState } from 'react';
import { mockProprietaire, mockPiscines } from '@/lib/mock-data';

export default function AdminClientsPage() {
  const [search, setSearch] = useState('');

  const clients = [{
    id: mockProprietaire.id,
    nom: `${mockProprietaire.prenom} ${mockProprietaire.nom}`,
    email: mockProprietaire.email,
    telephone: mockProprietaire.telephone || '+33 6 00 00 00 00',
    ville: 'Côte d\'Azur',
    piscines: mockPiscines.length,
    derniereIntervention: '6 mai 2026',
    portailToken: mockProprietaire.portailToken,
  }];

  const filtered = clients.filter(c =>
    c.nom.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-text font-display">Clients</h2>
          <p className="text-sm text-text-muted mt-0.5">{clients.length} client{clients.length > 1 ? 's' : ''} actif{clients.length > 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary text-sm py-2.5 px-4">+ Nouveau client</button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Rechercher un client…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base pl-11"
        />
      </div>

      {/* Cards grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((client) => (
          <div key={client.id} className="bg-white border border-border/70 rounded-2xl shadow-[0_1px_4px_rgba(11,94,168,0.06)] overflow-hidden hover:shadow-ocean-sm hover:border-primary/20 transition-all">
            {/* Card header */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 px-5 py-4 border-b border-border/50 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-primary/15 rounded-2xl flex items-center justify-center text-lg font-black text-primary font-display">
                  {client.nom[0]}
                </div>
                <div>
                  <h3 className="font-bold text-text">{client.nom}</h3>
                  <span className="text-[10px] font-semibold bg-success/10 text-success px-2 py-0.5 rounded-full">
                    Actif
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                {client.piscines} piscine{client.piscines > 1 ? 's' : ''}
              </span>
            </div>

            {/* Details */}
            <div className="px-5 py-4 space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-text-muted">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-text-muted">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{client.telephone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-text-muted">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{client.ville}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-text-muted">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Dernière intervention : <span className="font-semibold text-text">{client.derniereIntervention}</span></span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-5 pb-4 flex gap-2 border-t border-border/50 pt-4">
              <button className="flex-1 btn-primary text-xs py-2.5">Voir détails</button>
              <a
                href={`/portail/${client.portailToken}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 btn-secondary text-xs py-2.5 px-3"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Portail
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-14">
          <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-7 h-7 text-text-muted" />
          </div>
          <p className="font-semibold text-text-muted">Aucun client trouvé</p>
        </div>
      )}
    </div>
  );
}

