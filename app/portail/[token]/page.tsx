'use client';

import {
  Download,
  Droplets,
  Calendar,
  User,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  mockPortalPassages,
  mockPortalQuotes,
  mockProprietaire,
  mockPiscines,
  getWaterStatus,
  getWaterStatusColor,
  mockNormes,
} from '@/lib/mock-data';

interface PortalPageProps {
  params: {
    token: string;
  };
}

export default function PortalPage({ params }: PortalPageProps) {
  // In production, verify token and fetch actual data
  // For now, use mock data for the first pool
  const piscine = mockPiscines[0];
  const latestPassage = mockPortalPassages[0];
  const waterStatus = getWaterStatus(latestPassage.ph, latestPassage.chlore);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Pool Info */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-white px-4 py-8 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-bold font-display">{piscine.nom}</h1>
            <p className="text-white/80">{piscine.ville}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-bold border ${getWaterStatusColor(
              waterStatus
            )}`}
          >
            {waterStatus}
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-8 pb-12">
        {/* Latest Measurements */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text font-display">
            Dernières mesures
          </h2>

          <div className="grid grid-cols-3 gap-2">
            <MeasurementCard
              label="pH"
              value={latestPassage.ph}
              unit=""
              icon="💧"
              min={mockNormes.ph.min}
              max={mockNormes.ph.max}
            />
            <MeasurementCard
              label="Chlore"
              value={latestPassage.chlore}
              unit="ppm"
              icon="🧪"
              min={mockNormes.chlore.min}
              max={mockNormes.chlore.max}
            />
            <MeasurementCard
              label="Temp"
              value={latestPassage.temperature}
              unit="°C"
              icon="🌡️"
              min={mockNormes.temperature.min}
              max={mockNormes.temperature.max}
            />
          </div>

          <p className="text-xs text-text-muted">
            Mesuré le{' '}
            {format(latestPassage.date, 'd MMMM yyyy à HH:mm', { locale: fr })}
          </p>
        </section>

        {/* Passages History */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text font-display">
            Historique des passages
          </h2>

          <div className="space-y-2">
            {mockPortalPassages.map((passage, index) => (
              <div
                key={passage.id}
                className="bg-surface border border-border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className="font-semibold text-sm text-text">
                        {format(passage.date, 'd MMMM yyyy', { locale: fr })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      <p className="text-xs text-text-muted">
                        Technicien : {passage.technicien}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <StatusBadge
                        value={passage.ph}
                        min={mockNormes.ph.min}
                        max={mockNormes.ph.max}
                        label={`pH ${passage.ph}`}
                      />
                      <StatusBadge
                        value={passage.chlore}
                        min={mockNormes.chlore.min}
                        max={mockNormes.chlore.max}
                        label={`Cl ${passage.chlore} ppm`}
                      />
                      <StatusBadge
                        value={passage.temperature}
                        min={mockNormes.temperature.min}
                        max={mockNormes.temperature.max}
                        label={`${passage.temperature}°C`}
                      />
                    </div>
                  </div>

                  <button className="p-2 hover:bg-border rounded-lg transition-colors flex-shrink-0">
                    <Download className="w-5 h-5 text-primary" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Before/After Gallery */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-text font-display">
            Galerie avant/après
          </h2>

          <div className="space-y-6">
            {mockPortalPassages.slice(0, 3).map((passage, index) => (
              <div key={passage.id} className="space-y-2">
                <p className="text-xs font-semibold text-text-muted">
                  {format(passage.date, 'd MMMM', { locale: fr })}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg overflow-hidden bg-border">
                    <img
                      src={passage.photoBefore}
                      alt="Avant"
                      className="w-full aspect-square object-cover"
                    />
                    <p className="bg-surface text-xs font-semibold text-text text-center py-2">
                      Avant
                    </p>
                  </div>
                  <div className="rounded-lg overflow-hidden bg-border">
                    <img
                      src={passage.photoAfter}
                      alt="Après"
                      className="w-full aspect-square object-cover"
                    />
                    <p className="bg-success/10 text-xs font-semibold text-success text-center py-2">
                      Après
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pending Quotes */}
        {mockPortalQuotes.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-text font-display">
              Devis en attente
            </h2>

            {mockPortalQuotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-warning/10 border border-warning rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <p className="font-semibold text-text">
                      {quote.description}
                    </p>
                    <p className="text-xs text-text-muted">
                      Devis #{quote.numero}
                    </p>

                    <div className="flex items-center gap-2 text-sm mt-3">
                      <span className="font-bold text-warning">
                        {quote.montantTTC.toFixed(2)}€ TTC
                      </span>
                      <span className="text-xs text-text-muted">
                        (HT: {quote.montantHT.toFixed(2)}€)
                      </span>
                    </div>

                    <p className="text-xs text-text-muted mt-2">
                      Valide jusqu&apos;au{' '}
                      {format(quote.validJusqu, 'd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                </div>

                <button className="w-full bg-warning hover:bg-warning/90 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                  Signer le devis
                </button>
              </div>
            ))}
          </section>
        )}

        {/* WOW Message */}
        <section className="bg-primary/10 border-2 border-primary rounded-lg p-4 space-y-2">
          <p className="text-sm font-bold text-primary">
            ✓ Votre pisciniste utilise PoolTrack
          </p>
          <p className="text-xs text-primary/80">
            Chaque intervention est documentée, photographiée et archivée pour
            vous. Accédez à l&apos;historique complet de l&apos;entretien de
            votre piscine en toute sérénité.
          </p>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-6 space-y-2 text-center">
          <p className="text-xs text-text-muted flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Portail sécurisé - Accès privé
          </p>
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} PoolTrack - Tous droits réservés
          </p>
        </footer>
      </div>
    </div>
  );
}

function MeasurementCard({
  label,
  value,
  unit,
  icon,
  min,
  max,
}: {
  label: string;
  value: number;
  unit: string;
  icon: string;
  min: number;
  max: number;
}) {
  const isValid = value >= min && value <= max;

  return (
    <div
      className={`rounded-lg border-2 p-3 text-center space-y-1 ${
        isValid
          ? 'bg-success/10 border-success'
          : 'bg-danger/10 border-danger'
      }`}
    >
      <p className="text-xl">{icon}</p>
      <p className="text-xs font-semibold text-text-muted">{label}</p>
      <p className={`text-lg font-bold font-mono ${
        isValid ? 'text-success' : 'text-danger'
      }`}>
        {value}{unit}
      </p>
      <p className="text-xs text-text-muted">{min}–{max}</p>
    </div>
  );
}

function StatusBadge({
  value,
  min,
  max,
  label,
}: {
  value: number;
  min: number;
  max: number;
  label: string;
}) {
  const isValid = value >= min && value <= max;

  return (
    <span
      className={`text-xs font-bold px-2 py-1 rounded-full ${
        isValid
          ? 'bg-success/20 text-success'
          : 'bg-danger/20 text-danger'
      }`}
    >
      {label}
    </span>
  );
}
