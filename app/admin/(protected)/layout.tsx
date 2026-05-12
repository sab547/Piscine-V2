'use client';

import { Users, Droplets, ListChecks, BarChart3, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3, exact: true },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/techniciens', label: 'Techniciens', icon: Droplets },
  { href: '/admin/interventions', label: 'Interventions', icon: ListChecks },
];

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    localStorage.removeItem('user-name');
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    router.push('/');
  };

  const isActive = (item: typeof adminNavItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-3 border-b border-primary-dark">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold font-display">PoolTrack</h1>
            <p className="text-xs text-white/70">Espace Administrateur</p>
          </div>

          <div className="flex items-center gap-2">
            {/* History navigation */}
            <button
              onClick={() => router.back()}
              title="Page précédente"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.history.forward()}
              title="Page suivante"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-danger hover:bg-red-700 rounded-lg transition-colors font-semibold text-sm ml-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Quitter</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar — desktop */}
        <nav className="hidden md:flex w-60 bg-surface border-r border-border flex-col p-4 gap-1 min-h-screen sticky top-16">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                  active ? 'bg-primary text-white shadow-sm' : 'text-text hover:bg-border'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Content */}
        <main className="flex-1 px-4 py-6 pb-24 md:pb-8 min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav — only within admin space */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex z-40 safe-area">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 transition-all ${
                active ? 'text-primary' : 'text-text-muted'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
