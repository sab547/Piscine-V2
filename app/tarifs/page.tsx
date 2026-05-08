'use client';

import { CheckCircle2, Minus, Star, ArrowRight, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  techniciens: number;
  piscines: string;
  branding: boolean;
  recommended?: boolean;
}

const plans: Plan[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 79,
    description: 'Pour débuter',
    features: [
      'Tous les passages documentés',
      'Photos avant/après automatiques',
      'Mesures pH & Chlore',
      'Emails clients automatiques',
      'Portail client en lecture seule',
    ],
    techniciens: 1,
    piscines: '20',
    branding: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 129,
    description: 'Le plus populaire',
    features: [
      'Tout du plan Standard',
      '5 techniciens',
      'Piscines illimitées',
      'Gestion des anomalies',
      'Devis automatisés',
      'Rapports PDF personnalisés',
      'Support prioritaire',
    ],
    techniciens: 5,
    piscines: 'Illimité',
    branding: false,
    recommended: true,
  },
  {
    id: 'white-label',
    name: 'Marque Blanche',
    price: 199,
    description: 'Pour les agences',
    features: [
      'Tout du plan Pro',
      'Illimité (techniciens & piscines)',
      'Portail brandé à vos couleurs',
      'Domaine personnalisé',
      'Support dédié 24/7',
      'API accès',
      'Formation d&apos;équipe incluse',
    ],
    techniciens: 999,
    piscines: 'Illimité',
    branding: true,
  },
];

const valueProps = [
  {
    icon: '💰',
    title: 'Un seul client conservé',
    description: 'Paie le logiciel une année complète',
  },
  {
    icon: '⭐',
    title: 'Vous paraissez 10× plus professionnel',
    description: 'Rapports PDF, emails, portail client',
  },
  {
    icon: '✓',
    title: 'Zéro contestation. Zéro appel inutile.',
    description: 'Preuves photo & mesures horodatées',
  },
];

const faqs = [
  {
    question: 'Puis-je changer de plan à tout moment?',
    answer:
      'Oui, vous pouvez mettre à jour votre plan à tout moment. Les changements seront facturés au prorata.',
  },
  {
    question: 'Comment fonctionne l&apos;essai gratuit?',
    answer:
      'Accès complet à toutes les fonctionnalités pendant 14 jours sans saisir votre carte bancaire. Pas d&apos;engagement.',
  },
  {
    question: 'Que se passe-t-il après l&apos;essai gratuit?',
    answer:
      'Rien n&apos;est débité automatiquement. Vous devez activement vous abonner au plan de votre choix.',
  },
  {
    question: 'Quels sont les tarifs pour plus de techniciens?',
    answer:
      'Contactez-nous pour les tarifs personnalisés au-delà de 5 techniciens en formule Standard.',
  },
  {
    question: 'Y a-t-il un engagement minimum?',
    answer:
      'Non, vous pouvez résilier votre abonnement à tout moment sans pénalité.',
  },
  {
    question: 'Acceptez-vous les virements?',
    answer:
      'Actuellement, nous acceptons les cartes bancaires via Stripe. Contactez-nous pour les grandes entreprises.',
  },
];

export default function TarifsPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const router = useRouter();

  const startTrial = (planId: string) => {
    router.push(`/login?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-mist">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-ocean text-white px-4 py-16 space-y-6">
        <span aria-hidden className="shine-overlay" />
        <div className="relative max-w-2xl mx-auto text-center space-y-3">
          <p className="eyebrow !text-aqua-200">Tarification</p>
          <h1 className="display-1 !text-white">Des tarifs limpides</h1>
          <p className="text-lg text-white/85 font-body">
            Des plans adaptés à toutes les tailles de piscinerie
          </p>
          <p className="text-sm text-white/65">
            HT · Facturation mensuelle · Sans engagement
          </p>
        </div>

        {/* Free Trial Banner */}
        <div className="relative bg-white/15 backdrop-blur border border-white/25 rounded-2xl p-5 text-center max-w-md mx-auto">
          <p className="font-semibold mb-1 text-white">✨ Essai gratuit 14 jours</p>
          <p className="text-sm text-white/85">
            Sans carte bancaire · Accès complet à toutes les fonctionnalités.
          </p>
        </div>
      </div>

      <div className="px-4 py-12 max-w-6xl mx-auto space-y-16">
        {/* Value Propositions */}
        <section className="grid md:grid-cols-3 gap-4">
          {valueProps.map((prop, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-lg p-6 text-center space-y-3"
            >
              <p className="text-4xl">{prop.icon}</p>
              <h3 className="font-bold text-text">{prop.title}</h3>
              <p className="text-sm text-text-muted">{prop.description}</p>
            </div>
          ))}
        </section>

        {/* Pricing Cards */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-text font-display">
            Choisissez votre plan
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-lg transition-all ${
                  plan.recommended
                    ? 'ring-2 ring-primary shadow-xl md:scale-105'
                    : 'border border-border'
                } bg-surface p-6 space-y-6`}
              >
                {/* Recommended Badge */}
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 whitespace-nowrap">
                    <Star className="w-3 h-3" />
                    RECOMMANDÉ
                  </div>
                )}

                {/* Plan Header */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-text font-display">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-text-muted">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary font-mono">
                      {plan.price}€
                    </span>
                    <span className="text-text-muted">/mois HT</span>
                  </div>
                  <p className="text-xs text-text-muted">
                    Facturation mensuelle
                  </p>
                </div>

                {/* Limits */}
                <div className="bg-white rounded-lg p-3 space-y-2">
                  <div className="text-sm">
                    <p className="text-text-muted text-xs mb-1">Techniciens</p>
                    <p className="font-bold text-primary">
                      {plan.techniciens === 999 ? 'Illimité' : plan.techniciens}
                    </p>
                  </div>
                  <div className="border-t border-border pt-2 text-sm">
                    <p className="text-text-muted text-xs mb-1">Piscines</p>
                    <p className="font-bold text-primary">{plan.piscines}</p>
                  </div>
                  {plan.branding && (
                    <div className="border-t border-border pt-2 text-sm">
                      <p className="text-text-muted text-xs mb-1">Branding</p>
                      <p className="font-bold text-success">Personnalisé</p>
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => startTrial(plan.id)}
                  data-testid={`plan-cta-${plan.id}`}
                  className={`w-full ${plan.recommended ? 'btn-primary' : 'btn-outline'}`}
                >
                  Démarrer l&apos;essai gratuit
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-xs text-text-muted text-center">
                  14 jours. Pas de carte bancaire.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-text font-display">
            Comparaison détaillée
          </h2>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-text">
                    Fonctionnalité
                  </th>
                  <th className="text-center px-4 py-3 font-bold text-text">
                    Standard
                  </th>
                  <th className="text-center px-4 py-3 font-bold text-primary">
                    Pro
                  </th>
                  <th className="text-center px-4 py-3 font-bold text-text">
                    Marque Blanche
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(
                  [
                    { name: 'Passages documentés', s: true, p: true, m: true },
                    { name: 'Photos avant/après', s: true, p: true, m: true },
                    { name: 'Mesures pH & Chlore', s: true, p: true, m: true },
                    { name: 'Emails automatiques', s: true, p: true, m: true },
                    { name: 'Gestion anomalies', s: false, p: true, m: true },
                    { name: 'Devis automatisés', s: false, p: true, m: true },
                    { name: 'Rapports personnalisés', s: false, p: true, m: true },
                    { name: 'Portail brandé', s: false, p: false, m: true },
                    { name: 'API access', s: false, p: false, m: true },
                    { name: 'Support 24/7', s: false, p: false, m: true },
                  ] as { name: string; s: boolean; p: boolean; m: boolean }[]
                ).map((row, i) => (
                  <tr key={i} className="hover:bg-surface transition-colors">
                    <td className="px-4 py-3 text-text">{row.name}</td>
                    <td className="text-center px-4 py-3">
                      {row.s ? (
                        <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <Minus className="w-5 h-5 text-text-muted mx-auto" />
                      )}
                    </td>
                    <td className="text-center px-4 py-3">
                      {row.p ? (
                        <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <Minus className="w-5 h-5 text-text-muted mx-auto" />
                      )}
                    </td>
                    <td className="text-center px-4 py-3">
                      {row.m ? (
                        <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
                      ) : (
                        <Minus className="w-5 h-5 text-text-muted mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-text font-display">
            Questions fréquentes
          </h2>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === i ? null : i)
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-surface transition-colors text-left"
                >
                  <p className="font-semibold text-text flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    {faq.question}
                  </p>
                  <span
                    className={`text-primary transition-transform ${
                      expandedFaq === i ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {expandedFaq === i && (
                  <div className="px-4 py-3 bg-surface border-t border-border text-text-muted text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-gradient-ocean text-white rounded-2xl p-10 text-center space-y-5">
          <span aria-hidden className="shine-overlay" />
          <h2 className="display-2 !text-white relative">
            Prêt à transformer votre activité ?
          </h2>
          <p className="relative text-lg text-white/85 max-w-2xl mx-auto">
            Rejoignez les piscineries qui ont choisi PoolTrack pour augmenter leur
            professionnalisme et conserver leurs clients.
          </p>
          <button
            type="button"
            onClick={() => startTrial('pro')}
            data-testid="final-cta"
            className="relative btn bg-white text-primary hover:bg-white/95 hover:shadow-ocean-lg !min-h-[56px]"
          >
            Démarrer l&apos;essai gratuit
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>

        {/* Contact */}
        <section className="text-center space-y-2 pb-12">
          <p className="text-text-secondary">
            Besoin d&apos;aide pour choisir le bon plan ?
          </p>
          <a
            href="mailto:contact@pooltrack.com"
            data-testid="contact-link"
            className="inline-flex items-center gap-1 font-semibold text-primary hover:text-aqua-600 transition-colors"
          >
            Contactez notre équipe <ArrowRight className="w-4 h-4" />
          </a>
        </section>
      </div>
    </div>
  );
}
