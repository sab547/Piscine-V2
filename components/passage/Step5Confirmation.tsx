'use client';

import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Step5ConfirmationProps {
  proprietaireEmail?: string;
  timestamp?: Date;
}

export function Step5Confirmation({
  proprietaireEmail = 'client@example.com',
  timestamp = new Date(),
}: Step5ConfirmationProps) {
  const timeAgo = formatDistanceToNow(timestamp, { locale: fr });

  return (
    <div className="px-4 py-12 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="relative w-20 h-20">
        <CheckCircle2 className="w-20 h-20 text-success animate-bounce" />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-success font-display mb-2">
          Rapport envoyé ✓
        </h2>
        <p className="text-sm text-text-muted">
          Envoyé il y a {timeAgo}
        </p>
      </div>

      <div className="bg-surface border border-border rounded-lg p-4 w-full">
        <p className="text-xs text-text-muted mb-2">À :</p>
        <p className="text-base font-semibold text-text break-words">
          {proprietaireEmail}
        </p>
        <p className="text-xs text-text-muted mt-3">
          {new Date(timestamp).toLocaleString('fr-FR')}
        </p>
      </div>

      <div className="bg-accent/10 border border-accent rounded-lg p-4 w-full">
        <p className="text-sm font-semibold text-accent mb-2">
          📧 Message de confirmation
        </p>
        <p className="text-xs text-accent/80">
          Un email avec le rapport PDF a été envoyé au propriétaire. Il peut
          accéder à un portail de suivi en ligne.
        </p>
      </div>

      <Link
        href="/"
        className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
