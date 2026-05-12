'use client';

import { User, Bell, Shield, LogOut, ChevronRight, X, Eye, EyeOff, CheckCircle2, Monitor, Smartphone, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockTechnicien } from '@/lib/mock-data';

/* ─── Types ─────────────────────────────────────────────── */
type Modal = 'profile' | 'password' | 'sessions' | 'cgu' | 'privacy' | 'support' | null;

const MOCK_SESSIONS = [
  { id: 's1', device: 'Chrome · macOS', location: 'Cannes, FR', lastSeen: 'Maintenant', current: true, icon: 'desktop' },
  { id: 's2', device: 'Safari · iPhone 15', location: 'Nice, FR', lastSeen: 'Il y a 2h', current: false, icon: 'mobile' },
  { id: 's3', device: 'Firefox · Windows', location: 'Marseille, FR', lastSeen: 'Hier', current: false, icon: 'desktop' },
];

/* ─── Modal wrapper ──────────────────────────────────────── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-text font-display">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-surface rounded-lg transition-colors">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── Profile modal ──────────────────────────────────────── */
function ProfileModal({ onClose }: { onClose: () => void }) {
  const [prenom, setPrenom] = useState(mockTechnicien.prenom);
  const [nom, setNom] = useState(mockTechnicien.nom);
  const [email, setEmail] = useState(mockTechnicien.email);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  return (
    <Modal title="Modifier le profil" onClose={onClose}>
      {saved ? (
        <div className="flex flex-col items-center py-4 gap-3 text-success">
          <CheckCircle2 className="w-10 h-10" />
          <p className="font-semibold">Profil mis à jour !</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Prénom</label>
              <input value={prenom} onChange={e => setPrenom(e.target.value)} className="input-base" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Nom</label>
              <input value={nom} onChange={e => setNom(e.target.value)} className="input-base" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-base" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-outline">Annuler</button>
            <button type="submit" className="flex-1 btn-primary">Enregistrer</button>
          </div>
        </form>
      )}
    </Modal>
  );
}

/* ─── Password modal ─────────────────────────────────────── */
function PasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (next.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    if (next !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    setSaved(true);
    setTimeout(onClose, 1200);
  };

  return (
    <Modal title="Modifier le mot de passe" onClose={onClose}>
      {saved ? (
        <div className="flex flex-col items-center py-4 gap-3 text-success">
          <CheckCircle2 className="w-10 h-10" />
          <p className="font-semibold">Mot de passe mis à jour !</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-md bg-danger/10 text-danger text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Mot de passe actuel</label>
            <div className="input-wrap">
              <input type={showCurrent ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)} className="input-base pr-10" required />
              <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Nouveau mot de passe</label>
            <div className="input-wrap">
              <input type={showNext ? 'text' : 'password'} value={next} onChange={e => setNext(e.target.value)} className="input-base pr-10" required minLength={8} />
              <button type="button" onClick={() => setShowNext(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
                {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {next.length > 0 && (
              <div className="mt-1 h-1.5 rounded-full bg-border overflow-hidden">
                <div className={`h-full rounded-full transition-all ${next.length < 8 ? 'w-1/4 bg-danger' : next.length < 12 ? 'w-1/2 bg-warning' : 'w-full bg-success'}`} />
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Confirmer</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="input-base" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-outline">Annuler</button>
            <button type="submit" className="flex-1 btn-primary">Modifier</button>
          </div>
        </form>
      )}
    </Modal>
  );
}

/* ─── Sessions modal ─────────────────────────────────────── */
function SessionsModal({ onClose }: { onClose: () => void }) {
  const [sessions, setSessions] = useState(MOCK_SESSIONS);

  const revoke = (id: string) => setSessions(s => s.filter(x => x.id !== id));

  return (
    <Modal title="Sessions actives" onClose={onClose}>
      <div className="space-y-3">
        {sessions.map(s => (
          <div key={s.id} className={`flex items-start justify-between gap-3 p-3 rounded-lg border ${s.current ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <div className="flex items-start gap-3">
              {s.icon === 'mobile'
                ? <Smartphone className="w-5 h-5 text-text-muted mt-0.5 shrink-0" />
                : <Monitor className="w-5 h-5 text-text-muted mt-0.5 shrink-0" />}
              <div>
                <p className="text-sm font-semibold text-text">{s.device}</p>
                <p className="text-xs text-text-muted">{s.location} · {s.lastSeen}</p>
                {s.current && <span className="text-xs font-bold text-primary">Session actuelle</span>}
              </div>
            </div>
            {!s.current && (
              <button onClick={() => revoke(s.id)} className="text-xs text-danger hover:underline shrink-0 mt-1">
                Révoquer
              </button>
            )}
          </div>
        ))}
        {sessions.length === 1 && (
          <p className="text-xs text-text-muted text-center py-2">Aucune autre session active.</p>
        )}
      </div>
      <button onClick={onClose} className="w-full btn-outline">Fermer</button>
    </Modal>
  );
}

/* ─── Legal / Support modals ─────────────────────────────── */
function TextModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <Modal title={title} onClose={onClose}>
      <div className="text-sm text-text-secondary space-y-3 max-h-64 overflow-y-auto pr-1">{children}</div>
      <button onClick={onClose} className="w-full btn-outline">Fermer</button>
    </Modal>
  );
}

/* ─── Page principale ────────────────────────────────────── */
export default function ParametresPage() {
  const router = useRouter();
  const [modal, setModal] = useState<Modal>(null);
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    localStorage.removeItem('tenant-id');
    localStorage.removeItem('user-name');
    router.push('/');
  };

  return (
    <>
      <div className="px-4 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-text font-display">Paramètres</h1>

        {/* Profil */}
        <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
          <h2 className="font-semibold text-text flex items-center gap-2">
            <User className="w-5 h-5" /> Profil
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-text-muted mb-1">Nom</p>
              <p className="text-base font-semibold text-text">{mockTechnicien.prenom} {mockTechnicien.nom}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">Email</p>
              <p className="text-base font-semibold text-text">{mockTechnicien.email}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1">Rôle</p>
              <p className="text-base font-semibold text-text">Technicien</p>
            </div>
            <button onClick={() => setModal('profile')} className="w-full btn-primary text-sm mt-3">
              Modifier le profil
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
          <h2 className="font-semibold text-text flex items-center gap-2">
            <Bell className="w-5 h-5" /> Notifications
          </h2>
          <div className="space-y-3">
            {[
              { key: 'email', label: 'Notifications par email', desc: 'Recevoir des alertes par email' },
              { key: 'push', label: 'Notifications push', desc: 'Recevoir des notifications dans le navigateur' },
              { key: 'sms', label: 'Alertes par SMS', desc: 'Recevoir les alertes critiques par SMS' },
            ].map(option => (
              <label key={option.key} className="flex items-center gap-3 p-3 hover:bg-white/50 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={notifications[option.key as keyof typeof notifications]}
                  onChange={e => setNotifications(prev => ({ ...prev, [option.key]: e.target.checked }))}
                  className="w-5 h-5 rounded border-border cursor-pointer"
                />
                <div className="flex-1">
                  <p className="font-semibold text-text text-sm">{option.label}</p>
                  <p className="text-xs text-text-muted">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
          <h2 className="font-semibold text-text flex items-center gap-2">
            <Shield className="w-5 h-5" /> Sécurité
          </h2>
          <button onClick={() => setModal('password')} className="w-full flex items-center justify-between p-3 hover:bg-white/50 rounded-lg transition-colors">
            <div className="text-left">
              <p className="font-semibold text-text text-sm">Mot de passe</p>
              <p className="text-xs text-text-muted">Modifier votre mot de passe</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </button>
          <button onClick={() => setModal('sessions')} className="w-full flex items-center justify-between p-3 hover:bg-white/50 rounded-lg transition-colors border-t border-border/50 pt-3">
            <div className="text-left">
              <p className="font-semibold text-text text-sm">Sessions actives</p>
              <p className="text-xs text-text-muted">Gérer vos connexions</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        {/* Légal */}
        <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
          <p className="text-xs text-text-muted"><span className="font-semibold">PoolTrack</span> v1.0.0</p>
          <div className="flex flex-wrap gap-4 text-xs">
            <button onClick={() => setModal('cgu')} className="text-primary hover:text-primary-dark transition-colors">
              Conditions d'utilisation
            </button>
            <button onClick={() => setModal('privacy')} className="text-primary hover:text-primary-dark transition-colors">
              Politique de confidentialité
            </button>
            <button onClick={() => setModal('support')} className="text-primary hover:text-primary-dark transition-colors">
              Support
            </button>
          </div>
        </div>

        {/* Déconnexion */}
        <button onClick={handleLogout} className="w-full bg-danger/10 hover:bg-danger/20 text-danger font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5" />
          Se déconnecter
        </button>
      </div>

      {/* Modales */}
      {modal === 'profile'  && <ProfileModal  onClose={() => setModal(null)} />}
      {modal === 'password' && <PasswordModal onClose={() => setModal(null)} />}
      {modal === 'sessions' && <SessionsModal onClose={() => setModal(null)} />}
      {modal === 'cgu' && (
        <TextModal title="Conditions d'utilisation" onClose={() => setModal(null)}>
          <p>En utilisant PoolTrack, vous acceptez les présentes conditions d'utilisation.</p>
          <p>Le service est fourni «tel quel» pour les professionnels de la piscine. Toute utilisation non autorisée est interdite.</p>
          <p>PoolTrack se réserve le droit de modifier ces conditions à tout moment avec notification préalable.</p>
          <p>Pour toute question : <a href="mailto:legal@pooltrack.com" className="text-primary underline">legal@pooltrack.com</a></p>
        </TextModal>
      )}
      {modal === 'privacy' && (
        <TextModal title="Politique de confidentialité" onClose={() => setModal(null)}>
          <p>Vos données sont hébergées en Europe (RGPD). Nous ne vendons jamais vos données à des tiers.</p>
          <p>Données collectées : informations de profil, interventions, photos de piscines.</p>
          <p>Durée de conservation : 3 ans après résiliation du compte.</p>
          <p>Droit d'accès, rectification et suppression : <a href="mailto:privacy@pooltrack.com" className="text-primary underline">privacy@pooltrack.com</a></p>
        </TextModal>
      )}
      {modal === 'support' && (
        <TextModal title="Support" onClose={() => setModal(null)}>
          <p className="font-semibold">Besoin d'aide ?</p>
          <p>📧 <a href="mailto:support@pooltrack.com" className="text-primary underline">support@pooltrack.com</a></p>
          <p>📞 +33 4 00 00 00 00 (Lun–Ven 9h–18h)</p>
          <p>💬 Chat en direct disponible depuis le tableau de bord.</p>
          <p>📚 Documentation : <a href="https://docs.pooltrack.com" className="text-primary underline" target="_blank" rel="noopener noreferrer">docs.pooltrack.com</a></p>
        </TextModal>
      )}
    </>
  );
}
