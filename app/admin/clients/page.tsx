'use client';

import { Search, MapPin, Droplets, X, Phone, Mail, Calendar, ChevronRight, Waves } from 'lucide-react';
import { useState } from 'react';
import { mockProprietaire, mockPiscines, mockMissions } from '@/lib/mock-data';
import { StatutPassage } from '@/types';

interface Client {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
  piscines: number;
  derniereIntervention: string;
  portailToken: string;
}

const allClients: Client[] = [
  {
    id: mockProprietaire.id,
    nom: `${mockProprietaire.prenom} ${mockProprietaire.nom}`,
    email: mockProprietaire.email,
    telephone: mockProprietaire.telephone ?? '',
    ville: "Côte d'Azur",
    piscines: mockPiscines.length,
    derniereIntervention: '2026-05-06',
    portailToken: mockProprietaire.portailToken,
  },
];

function ClientDetailModal({ client, onClose }: { client: Client; onClose: () => void }) {
  const recentMissions = mockMissions.slice(0, 5);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
          <div>
            <h2 className="font-bold text-lg text-text">{client.nom}</h2>
            <p className="text-xs text-text-muted mt-0.5">Fiche client</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-border transition-colors text-text-muted hover:text-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Contact info */}
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Coordonnées</h3>
            <div className="bg-bg rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-text">{client.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-text">{client.telephone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-text">{client.ville}</span>
              </div>
            </div>
          </section>

          {/* Pools */}
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Piscines ({mockPiscines.length})
            </h3>
            <div className="space-y-2">
              {mockPiscines.map((pool) => (
                <div key={pool.id} className="bg-bg rounded-xl p-4 flex items-start gap-3">
                  <Waves className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text">{pool.nom}</p>
                    <p className="text-xs text-text-muted">{pool.adresse}, {pool.ville}</p>
                    {pool.volume && (
                      <p className="text-xs text-text-muted mt-1">Volume : {(pool.volume / 1000).toFixed(0)} m³</p>
                    )}
                    {pool.equipements && pool.equipements.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {pool.equipements.map((eq) => (
                          <span key={eq} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{eq}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent activity */}
          <section className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Interventions récentes</h3>
            <div className="space-y-2">
              {recentMissions.map((mission) => (
                <div key={mission.id} className="bg-bg rounded-xl p-3 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-text-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text truncate">{mission.client}</p>
                    <p className="text-xs text-text-muted">
                      {new Date(mission.datePrevu).toLocaleDateString('fr-FR')} · {mission.heure}
                    </p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    mission.statut === StatutPassage.COMPLETE ? 'bg-success/15 text-success' :
                    mission.statut === StatutPassage.EN_COURS ? 'bg-warning/15 text-warning' :
                    'bg-border text-text-muted'
                  }`}>
                    {mission.statut === StatutPassage.COMPLETE ? 'Terminé' :
                     mission.statut === StatutPassage.EN_COURS ? 'En cours' : 'Prévu'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex gap-2">
          <a
            href={`/portail/${client.portailToken}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-secondary text-sm text-center"
          >
            Portail client
          </a>
          <button onClick={onClose} className="flex-1 btn-primary text-sm">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminClientsPage() {
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filtered = allClients.filter(
    (c) =>
      c.nom.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title">Gestion des clients</h2>
      </div>

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

            <button
              onClick={() => setSelectedClient(client)}
              className="w-full btn-primary text-sm flex items-center justify-center gap-2"
            >
              Voir détails
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p>Aucun client trouvé</p>
        </div>
      )}

      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
        />
      )}
    </div>
  );
}
