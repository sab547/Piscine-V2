'use client';

import { Users, Droplets, ListChecks, BarChart3, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/techniciens', label: 'Techniciens', icon: Droplets },
  { href: '/admin/interventions', label: 'Interventions', icon: ListChecks },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Admin Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-4 border-b border-primary-dark">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-display">PoolTrack</h1>
            <p className="text-xs text-white/80">Espace Administrateur</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-3 py-2 bg-danger hover:bg-red-700 rounded-lg transition-colors text-white font-semibold text-sm"
          >
            <LogOut className="w-4 h-4" />
            Quitter
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="hidden md:flex w-64 bg-surface border-r border-border flex-col p-4 gap-2 min-h-screen sticky top-16">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary text-white font-semibold'
                    : 'text-text hover:bg-border'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex gap-2 p-2 z-40">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
