// Enums
export enum Plan {
  STANDARD = 'STANDARD',
  PRO = 'PRO',
  WHITE_LABEL = 'WHITE_LABEL',
}

export enum Role {
  GERANT = 'GERANT',
  TECHNICIEN = 'TECHNICIEN',
}

export enum StatutPassage {
  PLANIFIE = 'PLANIFIE',
  EN_COURS = 'EN_COURS',
  COMPLETE = 'COMPLETE',
  ANNULE = 'ANNULE',
}

export enum TypePhoto {
  AVANT = 'AVANT',
  APRES = 'APRES',
  ANOMALIE = 'ANOMALIE',
}

export enum Gravite {
  HAUTE = 'HAUTE',
  MOYENNE = 'MOYENNE',
  FAIBLE = 'FAIBLE',
}

export enum TypePiscine {
  PRIVEE = 'PRIVEE',
  COPROPRIETE = 'COPROPRIETE',
  HOTEL = 'HOTEL',
}

// Types
export interface Tenant {
  id: string;
  nom: string;
  siret?: string;
  logo?: string;
  email: string;
  telephone?: string;
  plan: Plan;
  stripeId?: string;
  actif: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
  actif: boolean;
  createdAt: Date;
}

export interface Proprietaire {
  id: string;
  tenantId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  portailToken: string;
  createdAt: Date;
}

export interface Piscine {
  id: string;
  tenantId: string;
  proprietaireId: string;
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  type: TypePiscine;
  volume?: number;
  equipements: string[];
  note?: string;
  actif: boolean;
  createdAt: Date;
}

export interface Passage {
  id: string;
  tenantId: string;
  piscineId: string;
  technicienId: string;
  statut: StatutPassage;
  datePrevu: Date;
  dateDebut?: Date;
  dateFin?: Date;
  ph?: number;
  chlore?: number;
  temperature?: number;
  actions: string[];
  note?: string;
  pdfUrl?: string;
  emailEnvoye: boolean;
  createdAt: Date;
}

export interface Photo {
  id: string;
  passageId: string;
  type: TypePhoto;
  url: string;
  createdAt: Date;
}

export interface Anomalie {
  id: string;
  passageId: string;
  description: string;
  gravite: Gravite;
  traite: boolean;
  traiteLe?: Date;
  devisId?: string;
  createdAt: Date;
}

// API Response wrapper
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
