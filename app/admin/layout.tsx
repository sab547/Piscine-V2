'use client';

import { Users, Droplets, ListChecks, BarChart3, LogOut, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setAuthed(true);
      return;
    }
    const ok = localStorage.getItem('admin_auth') === 'true';
    if (!ok) {
      router.replace('/admin/login');
    } else {
      setAuthed(true);
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') return <>{children}</>;
  if (!authed) return null;

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Admin Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-3.5 border-b border-primary-dark/40 shadow-ocean-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold font-display leading-none">PoolTrack</h1>
              <p className="text-[10px] text-white/70 mt-0.5">Espace Administrateur</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/15 hover:bg-white/25 active:scale-95 rounded-xl transition-all text-white font-semibold text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            Quitter
          </button>
        </div>
      </div>

      <div className="flex max-w-6xl mx-auto">
        {/* Sidebar */}
        <nav className="hidden md:flex w-56 flex-col p-3 gap-1 min-h-[calc(100vh-56px)] sticky top-14">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all text-sm font-semibold ${
                  isActive
                    ? 'bg-primary text-white shadow-ocean-sm'
                    : 'text-text-muted hover:text-text hover:bg-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Main content */}
        <main className="flex-1 px-4 py-6 pb-24 md:pb-6 min-w-0">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-border flex p-2 z-40 gap-1">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:text-text'
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
