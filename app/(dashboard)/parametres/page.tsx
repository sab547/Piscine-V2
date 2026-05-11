'use client';

import {
  Bell, Shield, LogOut, ChevronRight, Building2,
  Key, CreditCard, Mail, Copy, CheckCircle2, RefreshCw,
  Link as LinkIcon, Phone, Hash,
} from 'lucide-react';
import { useState } from 'react';
import { mockTechnicien } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-primary' : 'bg-border'}`}
      role="switch"
      aria-checked={checked}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border/70 rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(11,94,168,0.06)]">
      <div className="px-4 py-3.5 border-b border-border/50 flex items-center gap-2.5">
        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          {icon}
        </div>
        <h2 className="font-bold text-text text-sm">{title}</h2>
      </div>
      <div className="divide-y divide-border/40">{children}</div>
    </div>
  );
}

function SettingsRow({ label, value, onClick, rightEl }: {
  label: string; value?: string; onClick?: () => void; rightEl?: React.ReactNode;
}) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      className={`flex items-center justify-between px-4 py-3.5 w-full text-left ${onClick ? 'hover:bg-surface/50 active:bg-surface transition-colors' : ''}`}
      onClick={onClick}
    >
      <div>
        <p className="text-sm font-semibold text-text">{label}</p>
        {value && <p className="text-xs text-text-muted mt-0.5">{value}</p>}
      </div>
      {rightEl ?? (onClick && <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" />)}
    </Wrapper>
  );
}

export default function ParametresPage() {
  const router = useRouter();

  const [notifs, setNotifs] = useState({
    email: true,
    push: true,
    sms: false,
    retardIntervention: true,
    anomalie: true,
  });

  const [business, setBusiness] = useState({
    raisonSociale: 'PoolTrack Pro SARL',
    siret: '83245621900017',
    adresse: '12 Avenue de la Mer, 06400 Cannes',
    email: 'contact@pooltrackpro.fr',
    telephone: '+33 4 93 00 00 00',
  });

  const [rappelDelai, setRappelDelai] = useState(30);
  const [siretError, setSiretError] = useState('');
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const API_KEY = 'pt_live_7f3d9a2b8c1e4f6g0h5i';
  const PORTAL_LINK = 'https://pooltrack.fr/portail/token_001';

  const validateSiret = (v: string) => {
    if (v.length === 0) return setSiretError('');
    if (!/^\d+$/.test(v)) return setSiretError('Le SIRET ne doit contenir que des chiffres');
    if (v.length !== 14) return setSiretError('Le SIRET doit contenir exactement 14 chiffres');
    setSiretError('');
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(API_KEY).catch(() => {});
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(PORTAL_LINK).catch(() => {});
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_auth');
    }
    router.push('/');
  };

  return (
    <div className="pb-6 space-y-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#4A6A8A] to-[#2D4A6A] text-white px-5 pt-6 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold font-display">
            {mockTechnicien.prenom[0]}
          </div>
          <div>
            <h1 className="text-lg font-bold font-display">{mockTechnicien.prenom} {mockTechnicien.nom}</h1>
            <p className="text-sm text-white/70">{mockTechnicien.email}</p>
            <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full mt-1 inline-block">
              Technicien
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Entreprise */}
        <Section title="Informations entreprise" icon={<Building2 className="w-4 h-4" />}>
          <div className="px-4 py-4 space-y-3">
            <div>
              <label className="text-xs font-semibold text-text-muted mb-1 block">Raison sociale</label>
              <input
                className="input-base text-sm"
                value={business.raisonSociale}
                onChange={(e) => setBusiness({ ...business, raisonSociale: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted mb-1 flex items-center gap-1">
                <Hash className="w-3 h-3" /> SIRET
                <span className="text-danger ml-1">*</span>
              </label>
              <input
                className={`input-base text-sm font-mono ${siretError ? 'border-danger ring-2 ring-danger/10' : ''}`}
                value={business.siret}
                maxLength={14}
                onChange={(e) => {
                  setBusiness({ ...business, siret: e.target.value });
                  validateSiret(e.target.value);
                }}
                placeholder="14 chiffres obligatoires"
              />
              {siretError && <p className="text-xs text-danger mt-1">{siretError}</p>}
              {!siretError && business.siret.length === 14 && (
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> SIRET valide
                </p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email professionnel
              </label>
              <input
                type="email"
                className="input-base text-sm"
                value={business.email}
                onChange={(e) => setBusiness({ ...business, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Téléphone
              </label>
              <input
                type="tel"
                className="input-base text-sm"
                value={business.telephone}
                onChange={(e) => setBusiness({ ...business, telephone: e.target.value })}
              />
            </div>
            <button className="btn-primary w-full text-sm py-2.5">Enregistrer</button>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon={<Bell className="w-4 h-4" />}>
          {[
            { key: 'email', label: 'Alertes par email', desc: 'Rapports et anomalies' },
            { key: 'push', label: 'Notifications push', desc: 'Alertes temps réel' },
            { key: 'sms', label: 'SMS critiques', desc: 'Anomalies graves uniquement' },
            { key: 'anomalie', label: 'Alerte anomalie', desc: 'Dès qu\'une valeur sort des normes' },
            { key: 'retardIntervention', label: 'Retard intervention', desc: `Notification si pas de passage depuis ${rappelDelai}j` },
          ].map((opt) => (
            <div key={opt.key} className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-text">{opt.label}</p>
                <p className="text-xs text-text-muted">{opt.desc}</p>
              </div>
              <Toggle
                checked={notifs[opt.key as keyof typeof notifs]}
                onChange={(v) => setNotifs({ ...notifs, [opt.key]: v })}
              />
            </div>
          ))}
          <div className="px-4 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text">Délai de rappel</p>
              <p className="text-xs text-text-muted">Alerter si client sans intervention</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setRappelDelai(Math.max(7, rappelDelai - 7))} className="w-8 h-8 bg-surface rounded-xl font-bold text-primary flex items-center justify-center">−</button>
              <span className="text-sm font-bold font-mono w-10 text-center">{rappelDelai}j</span>
              <button onClick={() => setRappelDelai(Math.min(90, rappelDelai + 7))} className="w-8 h-8 bg-surface rounded-xl font-bold text-primary flex items-center justify-center">+</button>
            </div>
          </div>
        </Section>

        {/* Lien portail usage unique */}
        <Section title="Lien portail client" icon={<LinkIcon className="w-4 h-4" />}>
          <div className="px-4 py-4 space-y-2">
            <p className="text-xs text-text-muted">Lien à usage unique pour l'accès client sécurisé</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-surface border border-border rounded-xl px-3 py-2.5 font-mono text-text-muted truncate">
                {PORTAL_LINK}
              </code>
              <button
                onClick={copyLink}
                className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${linkCopied ? 'bg-success/10 text-success' : 'bg-surface hover:bg-primary/10 text-primary'}`}
              >
                {linkCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              <RefreshCw className="w-3 h-3" /> Régénérer un nouveau lien
            </button>
          </div>
        </Section>

        {/* Clé API */}
        <Section title="Clé API temporaire" icon={<Key className="w-4 h-4" />}>
          <div className="px-4 py-4 space-y-2">
            <p className="text-xs text-text-muted">Valide 24h — à utiliser pour l'intégration</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-surface border border-border rounded-xl px-3 py-2.5 font-mono text-text-muted truncate">
                {API_KEY}
              </code>
              <button
                onClick={copyApiKey}
                className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${apiKeyCopied ? 'bg-success/10 text-success' : 'bg-surface hover:bg-primary/10 text-primary'}`}
              >
                {apiKeyCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              <RefreshCw className="w-3 h-3" /> Générer une nouvelle clé
            </button>
          </div>
        </Section>

        {/* Paiement en ligne */}
        <Section title="Paiement en ligne" icon={<CreditCard className="w-4 h-4" />}>
          <div className="px-4 py-4 space-y-3">
            <div className="flex items-center gap-3 p-3 bg-surface rounded-xl">
              <div className="w-8 h-8 bg-[#635BFF]/10 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-[#635BFF]">S</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text">Stripe Payments</p>
                <p className="text-xs text-text-muted">Intégration paiement sécurisé</p>
              </div>
              <span className="text-[10px] font-bold bg-warning/10 text-warning px-2 py-0.5 rounded-full">Non configuré</span>
            </div>
            <button className="btn-primary w-full text-sm py-2.5">
              Configurer Stripe
            </button>
            <p className="text-xs text-text-muted text-center">Nécessite une clé API Stripe</p>
          </div>
        </Section>

        {/* Sécurité */}
        <Section title="Sécurité" icon={<Shield className="w-4 h-4" />}>
          <SettingsRow label="Modifier le mot de passe" value="Dernière modif. il y a 30j" onClick={() => {}} />
          <SettingsRow label="Sessions actives" value="1 session active (iPhone 15)" onClick={() => {}} />
          <SettingsRow label="Double authentification" value="Non activée" onClick={() => {}} />
        </Section>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-danger/10 hover:bg-danger/20 active:scale-[0.99] text-danger font-semibold py-3.5 px-4 rounded-2xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
