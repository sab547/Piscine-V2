'use client';

import { User, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockTechnicien } from '@/lib/mock-data';

export default function ParametresPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    localStorage.removeItem('tenant-id');
    localStorage.removeItem('user-name');
    router.push('/');
  };

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  return (
    <div className="px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-text font-display">
        Paramètres
      </h1>

      {/* Profile Section */}
      <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold text-text flex items-center gap-2">
          <User className="w-5 h-5" />
          Profil
        </h2>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-text-muted mb-1">Nom</p>
            <p className="text-base font-semibold text-text">
              {mockTechnicien.prenom} {mockTechnicien.nom}
            </p>
          </div>

          <div>
            <p className="text-xs text-text-muted mb-1">Email</p>
            <p className="text-base font-semibold text-text">
              {mockTechnicien.email}
            </p>
          </div>

          <div>
            <p className="text-xs text-text-muted mb-1">Rôle</p>
            <p className="text-base font-semibold text-text">Technicien</p>
          </div>

          <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors mt-3 text-sm">
            Modifier le profil
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold text-text flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications
        </h2>

        <div className="space-y-3">
          {[
            {
              key: 'email',
              label: 'Notifications par email',
              desc: 'Recevoir des alertes par email',
            },
            {
              key: 'push',
              label: 'Notifications push',
              desc: 'Recevoir des notifications dans le navigateur',
            },
            {
              key: 'sms',
              label: 'Alertes par SMS',
              desc: 'Recevoir les alertes critiques par SMS',
            },
          ].map((option) => (
            <label
              key={option.key}
              className="flex items-center gap-3 p-3 hover:bg-white/50 rounded-lg cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={notifications[option.key as keyof typeof notifications]}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    [option.key]: e.target.checked,
                  }))
                }
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

      {/* Security Section */}
      <div className="bg-surface border border-border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold text-text flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Sécurité
        </h2>

        <button className="w-full flex items-center justify-between p-3 hover:bg-white/50 rounded-lg transition-colors">
          <div className="text-left">
            <p className="font-semibold text-text text-sm">Mot de passe</p>
            <p className="text-xs text-text-muted">Modifier votre mot de passe</p>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted" />
        </button>

        <button className="w-full flex items-center justify-between p-3 hover:bg-white/50 rounded-lg transition-colors border-t border-border/50 pt-3">
          <div className="text-left">
            <p className="font-semibold text-text text-sm">Sessions actives</p>
            <p className="text-xs text-text-muted">Gérer vos connexions</p>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted" />
        </button>
      </div>

      {/* About & Legal */}
      <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
        <p className="text-xs text-text-muted">
          <span className="font-semibold">PoolTrack</span> v1.0.0
        </p>

        <div className="flex gap-4 text-xs text-primary hover:text-primary-dark transition-colors">
          <button>Conditions d'utilisation</button>
          <button>Politique de confidentialité</button>
          <button>Support</button>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full bg-danger/10 hover:bg-danger/20 text-danger font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Se déconnecter
      </button>
    </div>
  );
}
