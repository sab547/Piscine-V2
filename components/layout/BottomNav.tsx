'use client';

import { useEffect, useState } from 'react';
import { Home, Droplets, FileText, Settings, Calendar, Users, UserCheck, ListChecks, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const piscinasteNav = [
  { icon: Home,      label: 'Tableau',      href: '/entreprise' },
  { icon: Droplets,  label: 'Piscines',     href: '/piscines' },
  { icon: Users,     label: 'Techniciens',  href: '/entreprise/techniciens' },
  { icon: UserCheck, label: 'Clients',      href: '/entreprise/clients' },
  { icon: ListChecks,label: 'Interventions',href: '/entreprise/interventions' },
];

const technicienNav = [
  { icon: Home,     label: 'Accueil',  href: '/technicien' },
  { icon: Droplets, label: 'Piscines', href: '/piscines' },
  { icon: Calendar, label: 'Planning', href: '/planning' },
  { icon: FileText, label: 'Rapports', href: '/rapports' },
];

const genericNav = [
  { icon: Home,     label: 'Accueil',    href: '/' },
  { icon: Droplets, label: 'Piscines',   href: '/piscines' },
  { icon: FileText, label: 'Rapports',   href: '/rapports' },
  { icon: Settings, label: 'Paramètres', href: '/parametres' },
];

type NavItem = { icon: any; label: string; href: string };

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [navItems, setNavItems] = useState<NavItem[]>(genericNav);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const r = localStorage.getItem('user-role');
    setRole(r);
    if (r === 'pisciniste') setNavItems(piscinasteNav);
    else if (r === 'technicien') setNavItems(technicienNav);
    else setNavItems(genericNav);
  }, []);

  const isActive = (href: string) =>
    href === '/entreprise' || href === '/technicien' || href === '/'
      ? pathname === href
      : pathname.startsWith(href);

  // Pisciniste: 5 items, no + button
  if (role === 'pisciniste') {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-area">
        <div className="flex items-center">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </div>
      </div>
    );
  }

  // Technicien: 4 items + + button in center
  if (role === 'technicien') {
    const [left, right] = [navItems.slice(0, 2), navItems.slice(2)];
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-area">
        <div className="flex items-center justify-around py-2">
          {left.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
          <div className="w-14" />
          <button
            onClick={() => router.push('/passage/nouveau')}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
          {right.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </div>
      </div>
    );
  }

  // Generic / not logged in
  const [left, right] = [genericNav.slice(0, 2), genericNav.slice(2)];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border safe-area">
      <div className="flex items-center justify-around py-2">
        {left.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(item.href)} />
        ))}
        <div className="w-14" />
        <button className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 bg-primary hover:bg-primary-dark text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
          <Plus className="w-6 h-6" />
        </button>
        {right.map((item) => (
          <NavLink key={item.href} {...item} active={isActive(item.href)} />
        ))}
      </div>
    </div>
  );
}

function NavLink({ icon: Icon, label, href, active }: { icon: any; label: string; href: string; active: boolean }) {
  return (
    <Link href={href} className="flex-1 flex flex-col items-center justify-center py-2 px-1 transition-colors">
      <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-text-muted'}`} />
      <span className={`text-[10px] mt-1 font-semibold leading-none ${active ? 'text-primary' : 'text-text-muted'}`}>
        {label}
      </span>
    </Link>
  );
}
