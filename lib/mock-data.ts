import { Proprietaire, Piscine, Role, StatutPassage, TypePiscine } from '@/types';

export const mockTechnicien = {
  id: 'tech_001',
  nom: 'Benali',
  prenom: 'Karim',
  role: Role.TECHNICIEN,
  email: 'karim@pooltrack.fr',
};

export const mockProprietaire: Proprietaire = {
  id: 'prop_001',
  tenantId: 'tenant_001',
  nom: 'Martinez',
  prenom: 'Carlos',
  email: 'carlos@example.com',
  telephone: '+33 6 12 34 56 78',
  portailToken: 'token_001',
  createdAt: new Date(),
};

export const mockPiscines: Piscine[] = [
  {
    id: 'pool_001',
    tenantId: 'tenant_001',
    proprietaireId: 'prop_001',
    nom: 'Villa Martinez',
    adresse: '12 Bd de la Mer',
    ville: 'Cannes',
    codePostal: '06400',
    type: TypePiscine.PRIVEE,
    volume: 45000,
    equipements: ['Skimmer', 'Pompe 11kW', 'Filtre 400µm'],
    note: 'Piscine 10x4m, eau traitée au chlore',
    actif: true,
    createdAt: new Date(),
  },
  {
    id: 'pool_002',
    tenantId: 'tenant_001',
    proprietaireId: 'prop_001',
    nom: 'Résidence Les Pins',
    adresse: '45 Av. des Fleurs',
    ville: 'Antibes',
    codePostal: '06600',
    type: TypePiscine.COPROPRIETE,
    volume: 60000,
    equipements: ['Skimmer double', 'Pompe 15kW', 'Chlorinateur auto'],
    note: 'Piscine résidence 12x5m',
    actif: true,
    createdAt: new Date(),
  },
  {
    id: 'pool_003',
    tenantId: 'tenant_001',
    proprietaireId: 'prop_001',
    nom: 'Villa Durand',
    adresse: '8 Rte de la Corniche',
    ville: 'Nice',
    codePostal: '06000',
    type: TypePiscine.PRIVEE,
    volume: 30000,
    equipements: ['Skimmer', 'Pompe 8kW'],
    note: 'Petite piscine, entretien basique',
    actif: true,
    createdAt: new Date(),
  },
];

export const mockMissions = [
  {
    id: 'm1',
    heure: '08:30',
    client: 'Villa Martinez',
    adresse: '12 Bd de la Mer, Cannes',
    statut: StatutPassage.EN_COURS,
    piscineId: 'pool_001',
    datePrevu: new Date(),
  },
  {
    id: 'm2',
    heure: '10:00',
    client: 'Résidence Les Pins',
    adresse: '45 Av. des Fleurs, Antibes',
    statut: StatutPassage.PLANIFIE,
    piscineId: 'pool_002',
    datePrevu: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'm3',
    heure: '11:30',
    client: 'Villa Durand',
    adresse: '8 Rte de la Corniche, Nice',
    statut: StatutPassage.PLANIFIE,
    piscineId: 'pool_003',
    datePrevu: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'm4',
    heure: '09:00',
    client: 'Villa Fontaine',
    adresse: '3 Allée des Roses, Grasse',
    statut: StatutPassage.COMPLETE,
    piscineId: 'pool_001',
    datePrevu: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'm5',
    heure: '14:00',
    client: 'Résidence Les Pins',
    adresse: '45 Av. des Fleurs, Antibes',
    statut: StatutPassage.COMPLETE,
    piscineId: 'pool_002',
    datePrevu: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'm6',
    heure: '10:30',
    client: 'Villa Durand',
    adresse: '8 Rte de la Corniche, Nice',
    statut: StatutPassage.COMPLETE,
    piscineId: 'pool_003',
    datePrevu: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

export const mockNormes = {
  ph: { min: 7.0, max: 7.6, unite: 'pH' },
  chlore: { min: 1.0, max: 3.0, unite: 'ppm' },
  temperature: { min: 24, max: 28, unite: '°C' },
};

export const getStatusColor = (statut: StatutPassage) => {
  switch (statut) {
    case StatutPassage.COMPLETE:
      return 'bg-success text-white';
    case StatutPassage.EN_COURS:
      return 'bg-warning text-white';
    case StatutPassage.PLANIFIE:
      return 'bg-border text-text';
    case StatutPassage.ANNULE:
      return 'bg-danger text-white';
    default:
      return 'bg-surface text-text';
  }
};

export const getStatusLabel = (statut: StatutPassage) => {
  switch (statut) {
    case StatutPassage.COMPLETE:
      return 'Terminé';
    case StatutPassage.EN_COURS:
      return 'En cours';
    case StatutPassage.PLANIFIE:
      return 'Prévu';
    case StatutPassage.ANNULE:
      return 'Annulé';
    default:
      return statut;
  }
};

// Admin platform data — entreprises (tenants) and their techniciens
export const mockEntreprises = [
  {
    id: 'tenant_1',
    nom: 'Jean Dupont Piscines',
    email: 'pisciniste@example.com',
    ville: 'Nice',
    statut: 'actif' as const,
    nbTechniciens: 2,
    nbPiscines: 3,
    nbInterventions: 6,
    createdAt: '2025-01-15',
  },
];

export const mockAllTechniciens = [
  {
    id: 'tech_001',
    prenom: 'Karim',
    nom: 'Benali',
    email: 'technicien@example.com',
    entreprise: 'Jean Dupont Piscines',
    statut: 'actif' as const,
    derniereActivite: '2026-05-12 08:30',
    missions: 1,
  },
  {
    id: 'tech_002',
    prenom: 'Lucas',
    nom: 'Moreau',
    email: 'lucas.moreau@pooltrack.fr',
    entreprise: 'Jean Dupont Piscines',
    statut: 'actif' as const,
    derniereActivite: '2026-05-11 14:00',
    missions: 1,
  },
];

// Portal data
export const mockPortalPassages = [
  {
    id: 'passage_1',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    technicien: 'Karim Benali',
    statut: StatutPassage.COMPLETE,
    ph: 7.3,
    chlore: 1.8,
    temperature: 26,
    photoBefore: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%2300B4D8" width="300" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="20"%3EPiscine Avant%3C/text%3E%3C/svg%3E',
    photoAfter: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%2310B981" width="300" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="20"%3EPiscine Après%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'passage_2',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    technicien: 'Karim Benali',
    statut: StatutPassage.COMPLETE,
    ph: 7.1,
    chlore: 2.1,
    temperature: 25,
    photoBefore: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%2300B4D8" width="300" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="20"%3EPiscine Avant%3C/text%3E%3C/svg%3E',
    photoAfter: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%2310B981" width="300" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="20"%3EPiscine Après%3C/text%3E%3C/svg%3E',
  },
  {
    id: 'passage_3',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    technicien: 'Karim Benali',
    statut: StatutPassage.COMPLETE,
    ph: 7.5,
    chlore: 1.9,
    temperature: 27,
    photoBefore: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%2300B4D8" width="300" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="20"%3EPiscine Avant%3C/text%3E%3C/svg%3E',
    photoAfter: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%2310B981" width="300" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="20"%3EPiscine Après%3C/text%3E%3C/svg%3E',
  },
];

export const mockPortalQuotes = [
  {
    id: 'quote_1',
    numero: 'DEV-2026-0001',
    description: 'Remplacement filtre + nettoyage complet',
    montantHT: 250,
    montantTTC: 300,
    validJusqu: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    statut: 'ENVOYE',
  },
];

export function getWaterStatus(ph?: number, chlore?: number) {
  if (!ph || !chlore) return 'Inconnu';

  const phOk = ph >= mockNormes.ph.min && ph <= mockNormes.ph.max;
  const chloreOk = chlore >= mockNormes.chlore.min && chlore <= mockNormes.chlore.max;

  if (phOk && chloreOk) return 'Optimal';
  if (!phOk || !chloreOk) {
    if (ph > 8 || chlore < 0.5 || chlore > 4) return 'Alerte';
    return 'Attention';
  }
  return 'Attention';
}

export function getWaterStatusColor(status: string) {
  switch (status) {
    case 'Optimal':
      return 'bg-success/20 border-success text-success';
    case 'Attention':
      return 'bg-warning/20 border-warning text-warning';
    case 'Alerte':
      return 'bg-danger/20 border-danger text-danger';
    default:
      return 'bg-surface border-border text-text-muted';
  }
}
