'use client';

import { Home, Droplets, FileText, Settings, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: Home, label: 'Accueil', href: '/dashboard' },
  { icon: Droplets, label: 'Piscines', href: '/piscines' },
  { icon: Calendar, label: 'Planning', href: '/planning', center: true },
  { icon: FileText, label: 'Rapports', href: '/rapports' },
  { icon: Settings, label: 'Réglages', href: '/parametres' },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-border">
      <div className="flex items-end justify-around px-2 pt-2 pb-safe">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          if (item.center) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5 mb-1"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                    active
                      ? 'bg-primary-dark scale-105'
                      : 'bg-primary active:scale-95'
                  }`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span
                  className={`text-[10px] mt-1 font-semibold ${
                    active ? 'text-primary' : 'text-text-muted'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-end py-1 px-3 min-w-[56px] min-h-[56px] relative"
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-primary rounded-full" />
              )}
              <Icon
                className={`w-6 h-6 transition-colors ${
                  active ? 'text-primary' : 'text-text-muted'
                }`}
              />
              <span
                className={`text-[10px] mt-1 font-semibold transition-colors ${
                  active ? 'text-primary' : 'text-text-muted'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
