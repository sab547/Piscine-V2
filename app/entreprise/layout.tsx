'use client';

import { Home, Droplets, Users, UserCheck, ListChecks, Calendar, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const navItems = [
  { href: '/entreprise', label: 'Tableau de bord', icon: Home, exact: true },
  { href: '/piscines', label: 'Piscines', icon: Droplets },
  { href: '/entreprise/techniciens', label: 'Techniciens', icon: Users },
  { href: '/entreprise/clients', label: 'Clients', icon: UserCheck },
  { href: '/entreprise/interventions', label: 'Interventions', icon: ListChecks },
  { href: '/planning', label: 'Planning', icon: Calendar },
  { href: '/parametres', label: 'Paramètres', icon: Settings },
];

const mobileNav = navItems.slice(0, 5);

export default function EntrepriseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    localStorage.removeItem('tenant-id');
    localStorage.removeItem('user-name');
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    router.push('/');
  };

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary to-aqua-600 text-white px-4 py-4 border-b border-primary/30 shadow-md">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-bold font-display">PoolTrack</h1>
            <p className="text-xs text-white/70">Espace Entreprise</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white font-semibold text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar — desktop only */}
        <nav className="hidden md:flex w-60 bg-surface border-r border-border flex-col p-4 gap-1 min-h-screen sticky top-16 shrink-0">
          {navItems.map((item) => {
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

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex z-40 safe-area">
        {mobileNav.map((item) => {
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
              <span className="text-[10px] font-semibold leading-none">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
