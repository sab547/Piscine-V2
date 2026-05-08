'use client';

import { Home, Droplets, FileText, Settings, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { icon: Home, label: 'Accueil', href: '/' },
  { icon: Droplets, label: 'Piscines', href: '/piscines' },
  { icon: FileText, label: 'Rapports', href: '/rapports' },
  { icon: Settings, label: 'Paramètres', href: '/parametres' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-area">
      <div className="flex items-center justify-around py-3">
        {navItems.slice(0, 2).map((item) => (
          <NavLink key={item.href} {...item} active={pathname === item.href} />
        ))}

        <div className="w-4" />

        <button className="absolute bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
          <Plus className="w-6 h-6" />
        </button>

        {navItems.slice(2).map((item) => (
          <NavLink key={item.href} {...item} active={pathname === item.href} />
        ))}
      </div>
    </div>
  );
}

function NavLink({
  icon: Icon,
  label,
  href,
  active,
}: {
  icon: any;
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center py-2 px-3 transition-colors"
    >
      <Icon
        className={`w-6 h-6 ${
          active ? 'text-primary' : 'text-text-muted hover:text-text'
        }`}
      />
      <span
        className={`text-xs mt-1 font-body ${
          active ? 'text-primary font-semibold' : 'text-text-muted'
        }`}
      >
        {label}
      </span>
    </Link>
  );
}
