'use client';

import { ArrowLeft, Droplets, Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': '',
  '/piscines': 'Mes piscines',
  '/planning': 'Planning',
  '/rapports': 'Rapports',
  '/parametres': 'Paramètres',
  '/anomalies': 'Anomalies',
};

const MAIN_PAGES = ['/dashboard', '/piscines', '/planning', '/rapports', '/parametres', '/anomalies'];

export function TopBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isMainPage = MAIN_PAGES.includes(pathname);
  const pageTitle = PAGE_TITLES[pathname] ?? '';
  const isDashboard = pathname === '/dashboard' || pathname === '/';

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-4 py-3 min-h-[56px]">
        {/* Left: logo on main pages, back on sub-pages */}
        {isDashboard ? (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-primary font-display">PoolTrack</span>
          </Link>
        ) : isMainPage ? (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
          </div>
        ) : (
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-surface active:bg-surface rounded-xl transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="w-6 h-6 text-primary" />
          </button>
        )}

        {/* Center: title for non-dashboard pages */}
        <div className="flex-1 flex justify-center">
          {pageTitle && (
            <h1 className="text-base font-bold text-text font-display">{pageTitle}</h1>
          )}
        </div>

        {/* Right: notification bell on dashboard */}
        {isDashboard ? (
          <Link
            href="/anomalies"
            className="relative p-2 -mr-2 hover:bg-surface active:bg-surface rounded-xl transition-colors"
            aria-label="Anomalies"
          >
            <Bell className="w-5 h-5 text-text-muted" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white" />
          </Link>
        ) : (
          <div className="w-10" />
        )}
      </div>
    </div>
  );
}
