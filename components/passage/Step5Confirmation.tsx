'use client';

import { CheckCircle2, Mail, ArrowRight } from 'lucide-react';
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
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      {/* Success icon */}
      <div className="w-20 h-20 bg-success/10 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_0_8px_rgba(34,197,94,0.08)]">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>

      <h2 className="text-3xl font-black text-success font-display mb-1">
        Rapport envoyé
      </h2>
      <p className="text-sm text-text-muted">Il y a {timeAgo}</p>

      {/* Email card */}
      <div className="w-full mt-6 bg-white border border-border/70 rounded-2xl shadow-[0_1px_4px_rgba(11,94,168,0.06)] overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 bg-surface/60 border-b border-border/50">
          <Mail className="w-4 h-4 text-primary" />
          <p className="text-xs font-bold text-text-muted uppercase tracking-wide">Destinataire</p>
        </div>
        <div className="px-4 py-4">
          <p className="font-bold text-text break-all">{proprietaireEmail}</p>
          <p className="text-xs text-text-muted mt-1">
            {new Date(timestamp).toLocaleString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Confirmation message */}
      <div className="w-full mt-3 bg-accent/5 border border-accent/20 rounded-2xl p-4 text-left">
        <p className="text-sm font-bold text-accent mb-1">Confirmation envoyée</p>
        <p className="text-xs text-accent/80 leading-relaxed">
          Le rapport PDF a été transmis au propriétaire. Il peut accéder à son espace client via le lien personnalisé inclus dans l'email.
        </p>
      </div>

      {/* CTA */}
      <Link
        href="/dashboard"
        className="w-full mt-6 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-4 rounded-2xl shadow-ocean-sm active:scale-95 transition-all duration-150"
      >
        Retour à l'accueil
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
